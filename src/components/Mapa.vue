<template>
	<div id="mapa" class="mapa">
		<vl-map
			ref="map"
			v-if="!loading"
			:load-tiles-while-animating="true"
			:load-tiles-while-interacting="true"
			:style="{ cursor: mapCursor }"
			data-projection="EPSG:4326"
			style="height: 900px; background-color: #6f8094;"
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
					:key="`point-${point.properties.id}`"
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

				<vl-interaction-select :features.sync="selectedFeatures"></vl-interaction-select>
				<vl-overlay
					v-if="selectedFeatures.length > 0"
					:position="selectedFeatures[0].geometry.coordinates"
					:auto-pan="true"
					:auto-pan-animation="{ duration: 300 }"
				>
					<template>
						<section class="mapa__card">
							<header
								class="mapa__card-header"
								:style="!selectedFeatures[0].properties.capa ? `background-image: url('/src/assets/capas/${selectedFeatures[0].properties.nome} 135p.png')` : `background-image: url('${selectedFeatures[0].properties.capa}')`"
							>
								<button
									:style="{
										'background-color': selectedFeatures[0].properties.implantado ? '#5a67d7' : '#62b2ed'
									}"
									@click.prevent="selectedFeatures = []"
								>X</button>
							</header>
							<div class="mapa__card-content">
								<ul>
									<li>
										<div>
											<img src="/src/assets/icons/caixinha-pin.png" alt="Informações do local" />
										</div>
										<div>
											<h3>{{ selectedFeatures[0].properties.nome }}</h3>
											<p>{{ selectedFeatures[0].properties.endereco }}</p>
											<p>Subprefeitura: {{ selectedFeatures[0].properties.subprefeitura }}</p>
										</div>
									</li>
									<li>
										<div>
											<img src="/src/assets/icons/caixinha-status.png" alt="Situação" />
										</div>
										<div>
											<p>Implantação: {{ selectedFeatures[0].properties.dataImplantacao }}</p>
										</div>
									</li>
									<li>
										<div>
											<img src="/src/assets/icons/caixinha-link.png" alt="Link" />
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
		</vl-map>
		<div class="list">
			<div class="card">
				<a @click="expandChatList">
					<div class="card-header">
						<p class="card-header-title">
							<svg
								v-if="!showChatList"
								width="23"
								height="23"
								viewBox="0 0 400 248"
								fill="none" xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M47 247.666L200 94.9998L353 247.666L400 200.666L200 0.666504L0 200.666L47 247.666Z"
									fill="#4d5565"
								/>
							</svg>
							<svg
								v-else
								width="23"
								height="23"
								viewBox="0 0 400 248"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M47 0.334229L200 153.001L353 0.334229L400 47.3342L200 247.334L0 47.3342L47 0.334229Z"
									fill="#4d5565"
								/>
							</svg>
						</p>
					</div>
				</a>
				<div 
					id="listbox" 
					class="card-content"
					:style="showChatList ? 'display: block;': 'display: none;' "
				>

					<div class="endpoint andamento">Em andamento</div>
					<ul>
						<li :key="item.properties.id" v-for="item in emAndamentos">
							<span @click="setSelected(item.properties.id)">{{ item.properties.nome }}</span>
						</li>
					</ul>

					<div class="endpoint implantados">Implantados</div>
					<ul>
						<li :key="item.properties.id" v-for="item in implantados">
							<span @click="setSelected(item.properties.id)">{{ item.properties.nome }}</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import subprefeituras from '../assets/geojson/geojson-subprefeituras.geojson'
import unidades from '../assets/geojson/geojson-unidades.geojson'
import pin from '../assets/icons/pin.svg'

export default {
	name:'mapa',
	data () {
    return {
      zoom: 11.5,
			minZoom: 11.5,
			center: [-46.5614286546911, -23.58172651568904],
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
		// Adiciona a subprefeitura como propriedade de cada point
		let listaSubprefeituras = []
		this.features.forEach(obj => listaSubprefeituras[obj.properties.id - 1] = obj.properties.nome)
		console.log(listaSubprefeituras)
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
	/* watch: {
		selectedFeatures () {
			this.showChatList = false
		}
	}, */
	methods: {
		onMapPointerMove ({ pixel }) {
			let hitFeature = this.$refs.map.forEachFeatureAtPixel(pixel, feature => feature)
			try {
				if (hitFeature.get('isPoint')) {
					this.mapCursor = 'pointer'
					this.setSelected(hitFeature.get('id'))
				} else {
					this.mapCursor = 'default'
				}
			} catch (err) {
				console.log(err.message)
			}
		},
		expandChatList () {
      this.showChatList = !this.showChatList;      
		},
		setIdCentro () {
			this.$emit('idcentro', this.selectedFeatures[0].properties.id)
		},
		setSelected (id) {
			this.selectedFeatures = this.points.features.filter(f => f.properties.id === id)
		}
	}
}
</script>
