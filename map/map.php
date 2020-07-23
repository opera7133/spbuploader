<!DOCTYPE html>
<html lang="ja" class="h-100">

<head>
    <title><%TITLE> | SPBUploader</title>
    <meta charset="utf-8">
    <link rel="icon" type="image/png" href="/favicon.png">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="/assets/css/bootstrap.min.css">
</head>

<body class="d-flex flex-column h-100">
    <nav class="navbar navbar-expand-lg navbar-light fixed-top bg-light">
        <div class="container-fluid">
            <a class="navbar-brand" href="/">SPBUploader</a>
            <button type="button" class="navbar-toggler" data-toggle="collapse" data-target="#Navbar" aria-controls="Navbar" aria-expanded="false" aria-label="Responsive Navbar">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="Navbar">
                <ul class="navbar-nav mr-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="/">ホーム</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="/add">追加</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="/about">このサイトについて</a>
                    </li>
                </ul>
                <ul class="navbar-nav mb-2 mb-lg-0">
                    <li class="nav-item"><a class="nav-link" href="/login">ユーザー情報</a></li>
                    <li class="nav-item"><a class="nav-link" href="/contact">お問い合わせ</a></li>
                </ul>
            </div>
        </div>
    </nav>
    <div class="container">
        <h3 class="pt-3 mt-5"><%TITLE></h3>
        <p>Artist:<%ARTIST> / Charter:<%CHARTER></p>
        <div class="text-center">
            <iframe width="960" height="1280" id="sparebeat" src="https://sparebeat.com/embed/"
                frameborder="0"></iframe>
            <script src="https://sparebeat.com/embed/client.js"></script>
            <script>Sparebeat.load('<%JSON>', '<%AUDIO>');</script>
        </div>
    </div>
    <footer class="footer mt-auto pt-3 bg-light">
        <div class="container">
            <div class="row text-center">
                <div class="col-md-4 box">
                    <span class="text-muted">Made by <a href="https://github.com/opera7133/">wamo</a> /
                        Powered by <a href="https://sparebeat.com">Sparebeat</a></script>
                    </span>
                </div>
                <div class="col-md-4 box">

                </div>
                <div class="col-md-4 box">
                    <ul class="list-inline quick-links">
                        <li class="list-inline-item">
                            <a href="/privacy">プライバシーポリシー</a>
                        </li>
                        <li class="list-inline-item">
                            <a href="/terms" class="">利用規約</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </footer>
    <script src="/assets/js/jquery-3.5.1.min.js"></script>
    <script src="/assets/js/bootstrap.min.js"></script>
</body>

</html>