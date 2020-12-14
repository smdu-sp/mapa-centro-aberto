import './styles.scss'
const Preloader = () => import('./components/Preloader.vue')
const SectionMain = () => import('./components/SectionMain.vue')
const CentroAberto = () => import('./components/CentroAberto.vue')

new Vue({
	el: '#app',
	components: {
		Preloader,
		SectionMain,
		CentroAberto
	},
	data: {
		loaded: true,
		idcentro: 10
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