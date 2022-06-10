<?php
/*
Template Name: centro-aberto
*/
?>

	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
	<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v5.3.0/css/ol.css">
	<link rel="stylesheet" href="https://unpkg.com/vuelayers@0.11.37/lib/style.css">

	<div id="default-inner">
		<div class="wrapper">
			<div class="inner">
				<div id="app" class="app">
					<preloader v-if="loaded"></preloader>
					<mapa></mapa>
				</div>
		</div>
	</div>

	<script src="https://unpkg.com/vue@2.6.14/dist/vue.js"></script>
	<script src="https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v5.3.0/build/ol.js"></script>
	<script src="https://unpkg.com/vuelayers@0.11.37/lib/index.umd.js"></script>
	<script src="<?php echo get_template_directory_uri(); ?>/SPA/centro-aberto/main.min.js"></script>
	<noscript class="app-obrigatorio">
		<p>O seu navegador não suporta JavaScript ou este recurso não está ativo no momento. É necessário suporte ao JavaScript para a visualização do mapa interativo.</p>
		<p>Para mais informações e acesso à lista de unidades, acesse a página do <a href="/projetos-urbanos/centro-aberto/">Programa Centro Aberto</a>.</p>
	</noscript>
</div>
