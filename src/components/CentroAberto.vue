<template>
  <div class="centro">
    <section class="header">
      <div class="titulo">
        <h2>Centro Aberto - {{ unidade.properties.nome }}</h2>
        <div class="breadcrumb">
          <a @click="retornarIndex">Centro Aberto</a> >>
          <span>{{ unidade.properties.nome }}</span>
        </div>
      </div>
      <img :src="unidade.properties.capa" />
    </section>
    
    <section class="texto">
      <p>
        <b>Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit</b>
      </p>
      <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
      </p>
      <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
      </p>
    </section>

    <section class="beforeAfter">
      <div class="beforeAfter__imagem">
        <p>Antes</p>
        <img src="https://apps.todocartoes.com.br/assets/default-c430dc3f6bf8734aa34831c5394c3fae0ac302a036587b85b90fb4a4dd22f0fd.png">
      </div>
      <div class="beforeAfter__imagem">
        <p>Depois</p>
        <img src="https://apps.todocartoes.com.br/assets/default-c430dc3f6bf8734aa34831c5394c3fae0ac302a036587b85b90fb4a4dd22f0fd.png">
      </div>
    </section>

    <section class="texto">
      <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
      </p>
    </section>

    <section class="imagem">
      <img src="https://apps.todocartoes.com.br/assets/default-c430dc3f6bf8734aa34831c5394c3fae0ac302a036587b85b90fb4a4dd22f0fd.png">
    </section>

    <section class="galeria">
      <div class="galeria__header">
        Galeria de fotos
      </div>

      <div class="swiper-container">    
        <!-- swiper slides -->
        <div class="swiper-wrapper">
          <div class="swiper-slide" style="background-image: url(https://source.unsplash.com/random?sig=24);">
          </div>
        
          <div class="swiper-slide" style="background-image: url(https://source.unsplash.com/random?sig=53);">
          </div>
          
          <div class="swiper-slide" style="background-image: url(https://source.unsplash.com/random?sig=52);">
          </div>
          
          <div class="swiper-slide" style="background-image: url(https://source.unsplash.com/random?sig=21);">
          </div>
        
          <div class="swiper-slide" style="background-image: url(https://source.unsplash.com/random?sig=53);">
          </div>
        </div>
        <div class="swiper-pagination"></div>
      </div>
    </section>
  </div>
</template>

<script>
import unidades from '../assets/geojson/geojson-unidades.geojson'

export default {
  name: 'CentroAberto',
  data () {
    return {
      unidade: {},
      capa: '',
    }
  },
  props: {
    idcentro: {
      type: Number,
      required: true
    }
  },
  created () {
    this.$emit('loaded', 'carregando')
    this.filtrarUnidade()
  },
  mounted () {
    var Swipes = new Swiper('.swiper-container', {
      loop: true,
      pagination: {
        el: '.swiper-pagination',
      },
  });
  },
  methods: {
    filtrarUnidade () {
      const toObject = JSON.parse(unidades)
      this.unidade = toObject.features.filter(unidade => unidade.properties.id === this.idcentro)[0]
      document.title = `Centro Aberto - ${this.unidade.properties.nome}` 
      this.$emit('loaded', 'carregou')
    },
    retornarIndex () {
      this.$emit('reset')
    }
  }
}
</script>

<style lang="scss" scoped>
.centro {
  @media (max-width: 800px) {
    padding: 5px
  }

  .header {
    width: 100%;

    .titulo {
      width: 100%;
      justify-content: space-between;
      align-items: flex-end;
      display: flex;

      .breadcrumb {
        font-size: .9rem;
        margin-bottom: 1.4rem;
        a {
          cursor: pointer;
          text-decoration: none;
        }
        span {
          font-weight: bold;          
        }
      }
    }

    img {
      max-width: 100%; 
    }    
  }

  .texto {
    font-size: 11pt;
    margin: 30px 0px 30px 0px;
    color: rgba(0, 0, 0, .7);
  }

  .imagem {
    width: 100%;
    display: flex;
    justify-content: center;

    img {
      width: 70%;
      height: 400px;
    }
  }

  .beforeAfter {
    width: 100%;
    display: flex;
    justify-content: center;

    @media (max-width: 800px) {
      flex-direction: column;
    }

    &__imagem {
      width: 45%;
      padding: 0 5px 0 5px;

      @media (max-width: 800px) {
        width: 100%;
        padding: 0px;
      }

      p {
        margin-bottom: 4px;
        font-weight: bold;
      }
      img {
        width: 100%;
        height: 250px;
      }
    }
  }

  .galeria {
    width: 100%;
    margin: 30px 0px 30px 0px;

    &__header {
      width: 100%;
      color: #fff;
      font-weight: bold;
      border-radius: 5px;
      background-color: #63b3ed;
      padding: 10px;
    }

    .swiper-container {
      margin-top: 15px;
      width: 90%;
      height: 400px;

      .swiper-slide {
        width: 100% !important;
      }
    }
  }
}
</style>