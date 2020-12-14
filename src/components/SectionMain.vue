<template>
  <div class="main">
		<div class="titulo">
			<h2>Centro Aberto</h2>
		</div>

    <div class="body">
      <section class="body__conteudo">
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </p>
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </p>
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </p>
      </section>
      <section class="body__card-content">
        <div class="card">
          <div class="card__header card__header--metodologia">
            Metodologia
          </div>
          <div class="card__conteudo">
            Como parte do processo dos projetos Centro Aberto em São Paulo, foram realizadasoficinas-workshops.
            <br>
            <a href="#">Ir para página >></a>
          </div>
        </div>
        <div class="card">
          <div class="card__header card__header--saiba">
            Saiba mais
          </div>
          <div class="card__conteudo">
            <img src="https://apps.todocartoes.com.br/assets/default-c430dc3f6bf8734aa34831c5394c3fae0ac302a036587b85b90fb4a4dd22f0fd.png">
            <br />
            <a href="#">Baixe aqui o PDF</a>
          </div>
        </div>
      </section>
    </div>

    <mapa @idcentro="getIdCentro" />
  </div>
</template>

<script>
import Mapa from './Mapa.vue'
export default {
  name: 'SectionMap',
  components: {
    Mapa
  },
  methods: {
    getIdCentro (idcentro) {
      this.$emit('idcentro', idcentro)
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  width: 100%;

  .titulo {
    padding-left: 10px;
    padding-right: 10px;
  }

  .body {
    width: 100%;
    display: flex;
    
    &__conteudo {
      width: 80%;
      padding-left: 10px;
      padding-right: 10px;

      p {
        margin-top: 0;
      }
    }

    &__card-content {
      width: 20%;
      display: flex;
      flex-direction: column;

      .card {
        background-color: #f7fafc;
        margin-bottom: 15px;

        &__header {
          color: #fff;
          font-size: 14pt;
          text-align: center;
          padding: 5px;

          &--metodologia {
            background-color: #fc8180;
          }

          &--saiba {
            background-color: #63b3ed;
          }
        }

        &__conteudo {
          padding: 15px;
          img {
            width: 100%;
            height: 80px;
          }
        }
      }
    }
  }
}

</style>