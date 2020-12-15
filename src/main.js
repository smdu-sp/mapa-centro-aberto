import './styles.scss'
const Preloader = () => import('./components/Preloader.vue')
const Mapa = () => import('./components/Mapa.vue')

new Vue({
	el: '#app',
	components: {
		Preloader,
		Mapa
	},
	data: {
		loaded: true,
		idcentro: 0
	},
	computed: {
		showCentro () {
			return !!this.idcentro
		}
	},
	mounted () {
		this.changeLoaded()
	},
	methods: {
		getIdCentro (idcentro) {
			this.idcentro = idcentro
		},
		changeLoaded () {
			this.loaded = !this.loaded
		},
		reset () {
			this.changeLoaded()
			this.idcentro = 0
			setTimeout(() => {
				this.changeLoaded()
			}, 300);
		}
	}
})