<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="utf-8">
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.21/css/jquery.dataTables.css">
    <link rel="stylesheet" href="/assets/css/bootstrap.min.css">
    <script src="/assets/js/jquery-3.5.1.min.js"></script>
    <script src="/assets/js/bootstrap.min.js"></script>
</head>

<body>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">SPBUploader</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="/">ホーム</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="/add.html">追加</a>
                    </li>
                </ul>
                <ul class="navbar-nav mb-2 mb-lg-0">
                    <li class="nav-item"><a class="nav-link" href="#">ログイン / 登録</a></li>
                </ul>
            </div>
        </div>
    </nav>
    <div class="container">
        <h3 class="pt-3"><%TITLE></h3>
        <p>Artist:<%ARTIST> / Charter:<%CHARTER></p>
        <div class="text-center">
            <iframe width="960" height="1280" id="sparebeat" src="https://sparebeat.com/embed/"
                frameborder="0"></iframe>
            <script src="https://sparebeat.com/embed/client.js"></script>
            <script>Sparebeat.load('<%JSON>', '<%AUDIO>');</script>
        </div>
    </div>
</body>

</html>