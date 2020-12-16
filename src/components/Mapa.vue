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
										<svg
											width="15"
											height="15"
											viewBox="0 0 14 20"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												fill-rule="evenodd"
												clip-rule="evenodd"
												fill="black"
												fill-opacity="0.54"
												d="M0 7.26501C0 3.39502 3.13 0.265015 7 0.265015C10.87 0.265015 14 3.39502 14 7.26501C14 11.435 9.58002 17.185 7.77002 19.375C7.37 19.855 6.64001 19.855 6.23999 19.375C4.41998 17.185 0 11.435 0 7.26501ZM4.5 7.26501C4.5 8.64502 5.62 9.76501 7 9.76501C8.38 9.76501 9.5 8.64502 9.5 7.26501C9.5 5.88501 8.38 4.76501 7 4.76501C5.62 4.76501 4.5 5.88501 4.5 7.26501Z"
											/>
										</svg>
										<span>{{ feature.properties.nome }}</span>
									</li>
									<li>
										<svg
											width="15"
											height="15"
											viewBox="0 0 16 16"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												fill-rule="evenodd"
												clip-rule="evenodd"
												fill="black"
												fill-opacity="0.54"
												d="M14 0C14.83 0 15.5 0.669998 15.5 1.5V14.5C15.5 15.33 14.83 16 14 16C13.17 16 12.5 15.33 12.5 14.5V1.5C12.5 0.669998 13.17 0 14 0ZM2 10C2.82999 10 3.5 10.67 3.5 11.5V14.5C3.5 15.33 2.82999 16 2 16C1.17001 16 0.5 15.33 0.5 14.5V11.5C0.5 10.67 1.17001 10 2 10ZM9.5 6.5C9.5 5.67 8.82999 5 8 5C7.17001 5 6.5 5.67 6.5 6.5V14.5C6.5 15.33 7.17001 16 8 16C8.82999 16 9.5 15.33 9.5 14.5V6.5Z"
											/>
										</svg>

										<span>{{ feature.properties.implantado ? 'Implantado' : 'Em andamento' }}</span>
									</li>
									<li>
										<svg
											width="15"
											height="15"
											viewBox="0 0 600 600"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												fill="black"
												fill-opacity="0.54"
												d="M533.333 533.333H66.6667V66.6667H300V0H66.6667C29.6667 0 0 30 0 66.6667V533.333C0 570 29.6667 600 66.6667 600H533.333C570 600 600 570 600 533.333V300H533.333V533.333ZM366.667 0V66.6667H486.333L158.667 394.333L205.667 441.333L533.333 113.667V233.333H600V0H366.667Z"
											/>
										</svg>
										<a :href="feature.properties.url">Saiba mais</a>
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
			minZoom: 11.4,
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
