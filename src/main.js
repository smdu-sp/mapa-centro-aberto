import './styles.scss'
import Preloader from './components/Preloader.vue'
const Mapa = () => import('./components/Mapa.vue')

new Vue({
	el: '#app',
	components: {
		Preloader,
		Mapa
	},
	data: {
		loaded: false
	},
	methods: {
		isLoaded () {
			this.loaded = true
		}
	}
})