<template>
	<div id="mapa" class="mapa">
		<vl-map
			ref="map"
			v-if="!loading"
			:load-tiles-while-animating="true"
			:load-tiles-while-interacting="true"
			data-projection="EPSG:4326"
			style="height: 600px; background-color: #6f8094;"
		>
      <vl-view
        :zoom.sync="zoom"
				:min-zoom="minZoom"
				:center.sync="center"
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
							:src="point.properties.implantado ? src.pinImplantado : src.pinAndamento" 
							:scale=".4"
							:anchor="[0.5, 1]"
						/>
					</vl-style-box>
				</vl-feature>
			</vl-layer-vector>

			<vl-interaction-select :features.sync="selectedFeatures"></vl-interaction-select>
			<vl-overlay
			 	v-for="feature in selectedFeatures"
				:key="feature.properties.id"
        :id="feature.properties.id"
        :position="feature.geometry.coordinates"
				:auto-pan="true"
        :auto-pan-animation="{ duration: 300 }"
      >
				<template>
					<section class="mapa__card">
            <header
							class="mapa__card-header"
							:style="`background-image: url(${require(`../assets/capas/${feature.properties.capa}`)})`"
						></header>
            <div class="mapa__card-content">
							<ul>
								<li class="lista-nome">
									{{ feature.properties.nome }}
								</li>
								<li>
									{{ feature.properties.implantado ? 'Implantado' : 'Em andamento' }}
								</li>
								<li>
									<span>Saiba mais</span>
								</li>
							</ul>
            </div>
					</section>
				</template>
			</vl-overlay>
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

					<div class="endpoint andamento">
						Em andamento
					</div>
					<ul>
						<li :key="item.properties.id" v-for="item in emAndamentos">
							<span @click="setSelected(item.properties.id)">{{ item.properties.nome }}</span>
						</li>
					</ul>

					<div class="endpoint implantados">
						Implantados
					</div>
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
import pinAndamento from '../assets/icons/pin-em-andamento.svg'
import pinImplantado from '../assets/icons/pin-implantado.svg'

export default {
	name:'mapa',
	data () {
    return {
      zoom: 11,
			minZoom: 11,
      center: [-46.5614286546911, -23.58172651568904],
			rotation: 0,
			features: [],
			selectedFeatures: [],
			points: [],
			src: {
				pinAndamento: '',
				pinImplantado: '',
				capaSelected: ''
			},
			showChatList: false
    }
	},
	created () {		
		this.features = JSON.parse(subprefeituras)
		this.features = this.features.features
		this.points = JSON.parse(unidades)
		this.src.pinAndamento = pinAndamento
		this.src.pinImplantado = pinImplantado
	},
	computed: {
		implantados () {
			return this.points.features.filter(p => p.properties.implantado === true)
		},
		emAndamentos () {
			return this.points.features.filter(p => p.properties.implantado !== true)
		}
	},
	watch: {
		selectedFeatures () {
			this.showChatList = false
		}
	},
	methods: {
		expandChatList () {
      this.showChatList = !this.showChatList;      
		},
		setIdCentro () {
			this.$emit('idcentro', this.selectedFeatures[0].properties.id)
		},
		setSelected (id) {
			this.selectedFeatures = this.points.features.filter(f => f.properties.id === id)
		},
		onMapClick() {
			console.log('aqui')
		}
	}
}
</script>
