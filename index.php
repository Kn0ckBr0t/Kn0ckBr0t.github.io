<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./components/styles.css">
    <title>WorkWay</title>
</head>
<body>
    <section class="home">

    <header class="header">
        <ul>
            <li>
                <a href="./index.php"><img src="./assets/images/WorkWay.png" alt="logo" class="header__image"></a>
            </li>
            <div class="header__align">
                <li>
                    <a href="#">Quero começar</a>
                </li>
                <li>
                    <a href="#">Orientadores</a>
                </li>
                <li>
                    <a href="#">Sobre Nós</a>
                </li>
            </div>
            <div class="header__align">
                <li>
                    <a href="#">ENG | PT</a>
                </li>
                <li>
                    <a href="#">DARKMODE</a>
                </li>
            </div>
            <div class="header__align">
                <li>
                    <a href="#">ENTRAR</a>
                </li>
            </div>
        </ul>
    </header>
    <main class="home__container">
        <h1 class="home__title">
            Conectando Talentos ao Futuro de Grandes <span class="home__title--color">Oportunidades</span>
        </h1>
    </main>
    </section>
    <script src="https://website-widgets.pages.dev/dist/sienna.min.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
    <script>
        gsap.from(".home__title", { duration: 2.5, opacity: 0, x: '-5%', ease: "expo.out" });
    </script>
</body>
</html>