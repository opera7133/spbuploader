<!DOCTYPE html>
<html lang="ja" class="h-100">

<head>
    <title>追加 | SPBUploader</title>
    <link rel="icon" type="image/png" href="/favicon.png">
    <meta charset="utf-8">
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
        <h3 class="pt-3">完了</h3>

        <?php

        if (empty($_SERVER["HTTP_REFERER"])) {
            header('Location: /add');
        }
        $cfg['ALLOW_MIME'] = array('audio/mpeg', 'application/json');
        function makeRandStr($length)
        {
            $str = array_merge(range('a', 'z'), range('0', '9'), range('A', 'Z'));
            $r_str = null;
            for ($i = 0; $i < $length; $i++) {
                $r_str .= $str[rand(0, count($str) - 1)];
            }
            return $r_str;
        }

        function checkMIME($filename)
        {
            global $cfg;
            $mime = mime_content_type($filename);
            return in_array($mime, $cfg['ALLOW_MIME']);
        }

        $fileid = makeRandStr(8);

        $ctempfile = $_FILES['chartfile']['tmp_name'];
        $cfilename = './map/' . $fileid . '/' . $_FILES['chartfile']['name'];
        $atempfile = $_FILES['audiofile']['tmp_name'];
        $afilename = './map/' . $fileid . '/' . $_FILES['audiofile']['name'];

        $path = "./map/" . $fileid . '/';
        mkdir($path);

        if (is_uploaded_file($ctempfile)) {
            if (move_uploaded_file($ctempfile, $cfilename)) {
            } else {
                echo "譜面ファイルをアップロードできません。";
                exit();
            }
        } else {
            echo "譜面ファイルが選択されていません。";
            exit();
        }

        if (is_uploaded_file($atempfile)) {
            if (move_uploaded_file($atempfile, $afilename)) {
            } else {
                echo "音楽ファイルをアップロードできません。";
                exit();
            }
        } else {
            echo "音楽ファイルが選択されていません。";
            exit();
        }
        $template = "./map/map.php";
        $request_param = $_POST;

        $title = $request_param['title'];
        $charter = $request_param['charter'];
        $artist = $request_param['artist'];
        $chart = $_FILES['chartfile']['name'];
        $audio = $_FILES['audiofile']['name'];
        $easy = $request_param['easy'];
        $normal = $request_param['normal'];
        $hard = $request_param['hard'];

        $contents = file_get_contents($template);
        $contents = str_replace("<%TITLE>", htmlspecialchars($title), $contents);
        $contents = str_replace("<%CHARTER>", htmlspecialchars($charter), $contents);
        $contents = str_replace("<%ARTIST>", htmlspecialchars($artist), $contents);
        $contents = str_replace("<%JSON>", htmlspecialchars($chart), $contents);
        $contents = str_replace("<%AUDIO>", htmlspecialchars($audio), $contents);

        $handle = fopen($path . "index.php", 'w');
        fwrite($handle, $contents);
        fclose($handle);

        touch('./songs/songs.json');
        $json = file_get_contents('./songs/songs.json');
        $records = (array)json_decode($json, true);
        $i = count($records) + 1;
        $records[] = [
            "id" => $i,
            "title" => "<a href='/map/" . $fileid . "/'>" . $title . "</a>",
            "charter" => $charter,
            "artist" => $artist,
            "easy" => $easy,
            "normal" => $normal,
            "hard" => $hard
        ];
        $out_json = json_encode($records);
        file_put_contents('./songs/songs.json', $out_json, LOCK_EX);

        echo ("<p>譜面が投稿されました。<br>あなたの譜面は<a href='/map/" . $fileid . "/'>こちら</a>から遊べます。");
        ?>
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