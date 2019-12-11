@extends('layouts.app')

@section('content')
    	<div class="w-100" id="main-banner">
			<img src="{{ asset('img/TinyLogo.png') }}" alt="" srcset="">
			<h5 class="banner-text"><a href="/game">JUEGA AHORA!</a></h5>
			<!--Waves Container-->
			<div id="waves-container">
				<svg class="waves" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
					<defs>
						<path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
					</defs>
					<g class="parallax">
						<use xlink:href="#gentle-wave" x="48" y="0" fill="rgba(3, 182, 252, 0.7)" />
						<use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(3, 182, 252, 0.5)" />
						<use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(3, 182, 252, 0.3)" />
						<use xlink:href="#gentle-wave" x="48" y="7" fill="#94e1ff" />
					</g>
				</svg>
    		</div>
    	</div>
		<div class="container">
			<h2 class="title">Conoce el juego</h2>
			<div class="row">
				<div class="col-sm-12 col-md-6">
					<img src="{{ asset('img/tinyboat.png') }}" alt="">
				</div>
				<div class="col-sm-12 col-md-6">
					Juega contra el tiempo, recoge los sacos de comida antes de que se acabe el tiempo.
					<br><br>
					Ve de punto A a punto B, desafíate a ti mismo o a tus amigos en este emocionante juego.
					<br><br>
					El tiempo es tu mayor enemigo, junto a las piedras y a los tiburones que tratarán de comerse la comida que capturaste.
					<br><br>
					Comparte con tus amigos la experiencia y juega con ellos hasta el fin de los tiempos.
					<br><br>
				</div>
			</div>
		</div>
		<div class="container-fluid">
			<div class="row">
				<div class="col-12" id="play-now-banner">
					<h1 class="banner-text"><a href="/game">DA CLICK AQUÍ PARA COMENZAR A JUGAR!</a></h1>
				</div>
			</div>
		</div>
@endsection