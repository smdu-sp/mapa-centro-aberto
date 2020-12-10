<template>
	<div id="mapa" class="mapa">
		<div class="title">
			<h3>Centro Aberto</h3>
		</div>

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
				<vl-feature :key="index" v-for="(feature, index) in features" :properties="feature.properties">
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
				<vl-feature :key="index" v-for="(point, index) in points.features" :properties="point.properties">
					<vl-geom-point :coordinates="point.geometry.coordinates" />
					<vl-style-box>
						<vl-style-circle>
							<vl-style-fill :color="point.properties.implantado ? '#5a67d7' : '#62b2ed'"></vl-style-fill>
							<vl-style-stroke color="#ffffff"></vl-style-stroke>
						</vl-style-circle>
					</vl-style-box>
				</vl-feature>

				<!-- interactions -->
        <vl-interaction-select :features.sync="selectedFeatures">
          <template slot-scope="select">
            <vl-overlay
              v-for="feature in select.features"
              :key="feature.properties.id"
              :id="feature.properties.id"
              :position="feature.geometry.coordinates"
              :auto-pan="true"
              :auto-pan-animation="{ duration: 300 }"
              class=""
            >
							<template>
								<section class="mapa__card">
                  <header class="mapa__card-header">
                    <a
											@click="selectedFeatures = selectedFeatures.filter(f => f.properties.id !== feature.properties.id)"
											class="mapa__card-header-icon"
											title="Fechar"
										>
                      <div>Fechar</div>
                    </a>
                  </header>
                  <div class="mapa__card-content">
										<ul>
											<li class="lista-nome">
												{{ selectedFeatures[0].properties.nome }}
											</li>
											<li>
												{{ selectedFeatures[0].properties.implantado ? 'Implantado' : 'Em andamento' }}
											</li>
											<li>
												<a href="#">Saiba mais</a>
											</li>
										</ul>
                  </div>
								</section>
							</template>
            </vl-overlay>
          </template>
        </vl-interaction-select>
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
							<a href="#">{{ item.properties.nome }}</a>
						</li>
					</ul>

					<div class="endpoint implantados">
						Implantados
					</div>
					<ul>
						<li :key="item.properties.id" v-for="item in implantados">
							<a href="#">{{ item.properties.nome }}</a>
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
			showChatList: false
    }
	},
	created () {		
		this.features = JSON.parse(subprefeituras)
		this.features = this.features.features
		this.points = JSON.parse(unidades)
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
		onSourceCreated (sourceVm) {
      const map = this.$refs.map
      setTimeout(() => {
        map.$view.fit(sourceVm.$source.getExtent(), {
          size: map.$map.getSize(),
          duration: 1000
        })
      }, 500)
		},
		expandChatList () {
      this.showChatList = !this.showChatList;      
    }
	}
}
</script>
