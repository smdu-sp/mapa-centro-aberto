<template>
	<div id="mapa" class="mapa">
		<vl-map
			ref="map"
			v-if="!loading"
			:load-tiles-while-animating="true"
			:load-tiles-while-interacting="true"
			:style="{ cursor: mapCursor }"
			data-projection="EPSG:4326"
			style="background-color: #6f8094;"
			@pointermove="onMapPointerMove"
		>
			<vl-view
				:zoom.sync="zoom"
				:min-zoom="minZoom"
				:center.sync="center"
				ref="view"
				ident="view"
			/>
			
      		<vl-layer-vector>
				<vl-feature
					:key="`key-layer-${feature.properties.id}`"
					:ref="`layer-${feature.properties.id}`"
					v-for="feature in features"
					:properties="feature.properties"
				>
					<vl-geom-polygon :coordinates="feature.geometry.coordinates" />
					<vl-style-box>
						<vl-style-text
							:text="feature.properties.sp_nome"
							:scale="1"
							font="2000px"
							textAlign="center"
						/>
						<vl-style-stroke :width="1" color="#319FD3" />
						<vl-style-fill color="#EAF5FA" />
					</vl-style-box>
				</vl-feature>
      		</vl-layer-vector>

			<vl-layer-vector>
				<vl-feature
					:key="point.id"
					v-for="point in points.features"
					:properties="point.properties"
				>
					<vl-geom-point :coordinates="point.geometry.coordinates" />
					<vl-style-box>
						<vl-style-icon
							:src="src.pin" 
							:scale=".4"
							:anchor="[0.5, 1]"
						/>
					</vl-style-box>
				</vl-feature>

				<vl-overlay
					v-if="selectedFeatures.length > 0"
					:position="coordenadasOverlay"
					:offset="[0,-10]"
					positioning="top-center"
					:stop-event="true"
				>
					<template>
						<section class="mapa__card" @pointermove.stop="previneFechamento">
							<header
								class="mapa__card-header"
								:style="!selectedFeatures[0].properties.capa ? `background-image: url('${url + selectedFeatures[0].properties.nome} 135p.png')` : `background-image: url('${selectedFeatures[0].properties.capa}')`"
							>
								<button
									:style="{
										'background-color': '#434190'
									}"
									aria-label="Fechar"
									@click.prevent="selectedFeatures = []"
								>X</button>
							</header>
							<div class="mapa__card-content">
								<ul>
									<li>
										<div>
											<img :src="src.boxPin" alt="Informações do local" />
										</div>
										<div>
											<h3>{{ selectedFeatures[0].properties.nome }}</h3>
											<p>{{ selectedFeatures[0].properties.endereco }}</p>
											<p>Subprefeitura: {{ selectedFeatures[0].properties.subprefeitura }}</p>
										</div>
									</li>
									<li>
										<div>
											<img :src="src.boxStatus" alt="Situação" />
										</div>
										<div>
											<p>Implantação: {{ selectedFeatures[0].properties.dataImplantacao }}</p>
										</div>
									</li>
									<li>
										<div>
											<img :src="src.boxLink" alt="Link" />
										</div>
										<div>
											<a :href="selectedFeatures[0].properties.url" target="_blank">
												Ir para a página do Centro Aberto {{ selectedFeatures[0].properties.nome }}
											</a>
										</div>
									</li>
								</ul>
							</div>
						</section>
					</template>
				</vl-overlay>
			</vl-layer-vector>

			<vl-interaction-select  :features.sync="selectedFeatures" :filter="checaSelecao"></vl-interaction-select>

		</vl-map>

	</div>
</template>
<script>
import subprefeituras from '../assets/geojson/geojson-subprefeituras.geojson'
import unidades from '../assets/geojson/geojson-unidades.geojson'
import pin from '../assets/icons/mapa-pin.png'
import boxPin from '../assets/icons/caixinha-pin.png'
import boxStatus from '../assets/icons/caixinha-status.png'
import boxLink from '../assets/icons/caixinha-link.png'

export default {
	name:'mapa',
	data () {
    return {
      zoom: 10.7,
			minZoom: 10.5,
			center: [-46.62, -23.67],
			features: [],
			selectedFeatures: [],
			points: [],
			extent: [30,30,30,30],
      mapCursor: 'default',
			src: {
				pin: '',
				capaSelected: ''
			},
			showChatList: false
    }
	},
	created () {		
		this.features = JSON.parse(subprefeituras)
		this.features = this.features.features
		this.points = JSON.parse(unidades)
		this.src.pin = pin
		this.src.boxPin = boxPin
		this.src.boxStatus = boxStatus
		this.src.boxLink = boxLink
		this.url = '/wp-content/themes/gestaourbana-1.4/SPA/centro-aberto/capas/'
		// Adiciona a subprefeitura como propriedade de cada point
		let listaSubprefeituras = []
		this.features.forEach(obj => listaSubprefeituras[obj.properties.id - 1] = obj.properties.nome)
		this.points.features.forEach(obj => obj.properties.subprefeitura = listaSubprefeituras[obj.properties.idSubprefeitura - 1])
	},
	computed: {
		implantados () {
			return this.points.features.filter(p => p.properties.implantado === true)
		},
		emAndamentos () {
			return this.points.features.filter(p => p.properties.implantado !== true)
		}
	},
	methods: {
		onMapPointerMove({ pixel }) {
			let hitFeature = this.$refs.map.forEachFeatureAtPixel(pixel, feature => feature)
			if (hitFeature) {
				if (hitFeature.get('isPoint')) {
					this.mapCursor = 'pointer'
					this.setSelected(hitFeature.get('idUnidade'))
					this.coordenadasOverlay = this.posicionaOverlay()
					return
				} 
			}
			// Caso o mouse não esteja sobre feature, ou se feature não seja point, reseta o cursor e a seleção
			this.mapCursor = 'default'
			this.setSelected(0)
		},
		posicionaOverlay(feature = false) {
			let coordenadas = []
			if (!feature) {
				coordenadas = [...this.selectedFeatures[0].geometry.coordinates]
			} else {
				// Converte as coordenadas 'Pseudo-Mercator' utilizadas pelo OpenLayers em
				// coordenadas de Latitude e Longitude utilizadas pela aplicação
				const coordenadasRaw = feature.getGeometry().getCoordinates()
				const src = 'EPSG:3857'
				const dest = 'EPSG:4326'
				coordenadas = [...ol.proj.transform(coordenadasRaw, src, dest)]
			}
			return coordenadas
		},
		previneFechamento() {
			this.mapCursor = 'default'
			return true
		},
		expandChatList() {
      		this.showChatList = !this.showChatList;      
		},
		setIdCentro() {
			this.$emit('idcentro', this.selectedFeatures[0].properties.idUnidade)
		},
		setSelected(id) {
			if (id != 0) {
				return this.selectedFeatures = this.points.features.filter(f => f.properties.idUnidade === id)
			}
			return this.selectedFeatures = [];
		},
		checaSelecao(feature) {
			if (this.selectedFeatures.length > 0) {
				this.selectedFeatures = []
			}
			if (feature.get('isPoint')) {
				this.coordenadasOverlay = this.posicionaOverlay(feature);
				return true
			}
			return false
		}
	}
}
</script>
