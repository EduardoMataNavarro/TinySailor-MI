<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Scripts -->
    <script src="{{ asset('js/app.js') }}" defer></script>

    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Sulphur+Point&display=swap" rel="stylesheet"> 

    <!-- Styles -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
    <link href="{{ asset('css/landingStyle.css') }}" rel="stylesheet">
    <link rel="icon" href="{{ asset('img/icon.ico') }}" type="image/x-icon" />
</head>
<body>
    <div id="app">
        <nav class="navbar navbar-expand-lg navbar-light navbar-fixed-top" id="main-nav"> 
            <a class="navbar-brand" href="/">Tiny Sailor</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" href="/">Home</a>
                </li>
                @auth 
                <li class="nav-item">
                    <a class="nav-link" href="{{ url('/game') }}">Juega!</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="{{ url('/getscores') }}">Posiciones</a>
                </li>
                @endauth
                @guest
                <li class="nav-item">
                    <a href="{{ url('/register') }}" class="nav-link">Registrate</a>
                </li>
                <li class="nav-item">
                    <a href="{{ url('/login') }}" class="nav-link">Inicia sesión</a>
                </li>
                @else
                <li class="nav-item dropdown">
                    <a id="navbarDropdown" class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-pre>
                        {{ Auth::user()->name }} <span class="caret"></span>
                    </a>
                    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                        <a class="dropdown-item" href="{{ route('logout') }}"
                            onclick="event.preventDefault();
                                            document.getElementById('logout-form').submit();">
                            {{ __('Logout') }}
                        </a>
                        <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                                        @csrf
                        </form>
                    </div>
                </li>
                @endguest
            </ul>
            </div>
		</nav>

        <main class="py-4">
            @yield('content')
        </main>
        <footer>
            <div class="container-fluid">
                <div class="row">
                    <div class="col-md-4">
                        <h4>Disclaimer</h4>
                        <br>
                        <p>proyecto realizado con THREE.js, Laravel y todas las ganas del mundo
                            <br>
                            El contenido utilizado para la realización de este proyecto pertenece a sus autores
                            <br>
                            No soy dueño del mismo.
                        </p>
                    </div>
                    <div class="col-md-4">
                        <h4>Juega ahora</h4>
                        <br>
                        <p>
                            Juega ahora esta emocionante aventura para dos personas, en la que consumiras un servicio web
                            <br>
                            utilizarás modelos 3D, partículas, texturas, un shader para el terreno 
                            <br>
                            sin olvidar de las colisiones que a todos nos gustan
                            <br>
                            Da click <a href="/game">aquí</a>
                        </p>
                        <br>
                    </div>
                    <div class="col-md-4">
                        <h4>Puntuaciones</h4>
                        <br>
                        <p>
                            Revisa y compara las puntuaciones de tus amigos, hazles saber quién es el mejor!
                            <br>
                            Da click <a href="/getscores">aquí</a> para revisar las puntuaciones.
                        </p>
                        <br><br>
                    </div>
                </div>
            </div>
        </footer>
    </div>
</body>
    <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
	<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
</html>
