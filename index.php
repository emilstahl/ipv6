<?php
ini_set('date.timezone', 'Europe/Copenhagen');
setlocale(LC_TIME, 'da_DK.UTF-8');
setlocale(LC_ALL, 'da_DK');

function slugify($text){

    $text = preg_replace('~[^\\pL\d]+~u', '-', $text);
    $text = trim($text, '-');
    $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);
    $text = strtolower($text);
    $text = preg_replace('~[^-\w]+~', '', $text);

    if(empty($text)){
        return 'n-a';
    }

    return $text;
}

function renderRow($item, $class, $nofollow = true) {
    $output = '<tr class="' . $class . '" id="' . slugify($item->name) . '">';
    $output .= '<td><a' . ($nofollow ? ' rel="nofollow"' : '') . ' href="' . htmlspecialchars($item->url) . '" class="alert-link" target="_blank">' . htmlspecialchars($item->name) . '</a></td>';
    $output .= '<td>' . ($item->ipv6 ? 'Ja' : 'Nej') . '</td>';
    $output .= '<td>' . htmlspecialchars($item->comment) . '</td>';
    if (null !== $item->sources[0]->url) {
        $output .= '<td><a' . ($nofollow ? ' rel="nofollow"' : '') . ' href="' . htmlspecialchars($item->sources[0]->url) . '">'  . htmlspecialchars($item->sources[0]->name) . '</a></td>';
    } else {
        $output .= '<td>' . htmlspecialchars($item->sources[0]->name) . '</td>';
    }

    $output .= '<td>' . (new DateTime($item->sources[0]->date))->format('d. M. y') . '</td>';
    $output .= '</tr>';

    return $output;
}


// Load in data from JSON

$data = json_decode(file_get_contents('data.json'));
//header('Content-Type: text/plain');

$stats = [
    'count' => 0,
    'full_ipv6' => 0,
    'some_ipv6' => 0,
];

$fullArray = [];
$partialArray = [];
$unsupportedArray = [];

foreach ($data as $item) {
    $stats['count']++;
    if ($item->ipv6) {
        if ($item->partial) {
            $stats['some_ipv6']++;
            if ($item->partial) {
                $partialArray[] = $item;
            }
        } else {
            $stats['full_ipv6']++;
            $fullArray[] = $item;
        }
    } else {
        $unsupportedArray[] = $item;
    }
}

$ip = $_SERVER['REMOTE_ADDR'];

?>
    <!DOCTYPE html>
    <html lang="da">
    <head>
        <meta charset="utf-8">
        <style>.async-hide { opacity: 0 !important} </style>
        <script>(function(a,s,y,n,c,h,i,d,e){s.className+=' '+y;h.start=1*new Date;
                h.end=i=function(){s.className=s.className.replace(RegExp(' ?'+y),'')};
                (a[n]=a[n]||[]).hide=h;setTimeout(function(){i();h.end=null},c);h.timeout=c;
            })(window,document.documentElement,'async-hide','dataLayer',50,
                {'GTM-K3Z2X87':true});</script>
        <script>
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
            ga('create', 'UA-44452629-1', 'auto');
            ga('require', 'displayfeatures');
            ga('require', 'linkid', 'linkid.js');
            ga('require', 'GTM-K3Z2X87');
            ga('send', 'pageview');
            var _paq = _paq || [];
            _paq.push(['trackPageView']);
            _paq.push(['enableLinkTracking']);
            _paq.push(['logAllContentBlocksOnPage']);
        </script>
        <title>Internetudbydere og IPv6 understøttelse - IPv6-adresse.dk</title>
        <meta name="viewport" content="width=device-width, initial-scale=0.7, user-scalable=no, shrink-to-fit=no">
        <!--   <link rel="dns-prefetch" href="//cdn.ipv6-adresse.dk"> -->
        <link rel="apple-touch-icon" sizes="57x57" href="resources/apple-touch-icon-57x57.png">
        <link rel="apple-touch-icon" sizes="60x60" href="resources/apple-touch-icon-60x60.png">
        <link rel="apple-touch-icon" sizes="72x72" href="resources/apple-touch-icon-72x72.png">
        <link rel="apple-touch-icon" sizes="76x76" href="resources/apple-touch-icon-76x76.png">
        <link rel="apple-touch-icon" sizes="114x114" href="resources/apple-touch-icon-114x114.png">
        <link rel="apple-touch-icon" sizes="120x120" href="resources/apple-touch-icon-120x120.png">
        <link rel="apple-touch-icon" sizes="144x144" href="resources/apple-touch-icon-144x144.png">
        <link rel="apple-touch-icon" sizes="152x152" href="resources/apple-touch-icon-152x152.png">
        <link rel="apple-touch-icon" sizes="180x180" href="resources/apple-touch-icon-180x180.png">
        <link rel="icon" type="image/png" href="resources/favicon-32x32.png" sizes="32x32">
        <link rel="icon" type="image/png" href="resources/android-chrome-192x192.png" sizes="192x192">
        <link rel="icon" type="image/png" href="resources/favicon-96x96.png" sizes="96x96">
        <link rel="icon" type="image/png" href="resources/favicon-16x16.png" sizes="16x16">
        <link rel="manifest" href="manifest.json">
        <link rel="mask-icon" href="resources/safari-pinned-tab.svg" color="#5cb85c">
        <meta name="msapplication-TileColor" content="#ffffff">
        <meta name="msapplication-TileImage" content="resources/mstile-144x144.png">
        <meta name="theme-color" content="#ffffff">
        <meta name="description" content="IPv6-adresse.dk kortlægger internetudbydere og deres (manglende) understøttelse af IPv6. Find din udbyder på listen." />
        <link rel="author" href="https://plus.google.com/105182684020979467235" />
        <meta name="author" content="Emil Stahl">
        <meta property="og:locale" content="da_DK" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Internetudbydere og IPv6 understøttelse - IPv6-adresse.dk" />
        <meta property="og:description" content="IPv6-adresse.dk kortlægger internetudbydere og deres (manglende) understøttelse af IPv6. Find din udbyder på listen." />
        <meta property="og:url" content="https://ipv6-adresse.dk"/>
        <meta property="og:site_name" content="IPv6-adresse.dk" />
        <meta property="og:image" content="resources/images/icon.png"/>
        <link rel="stylesheet" href="resources/bootstrap.min.css">
        <link href="https://fonts.googleapis.com/css?family=Fira+Sans:300" rel="stylesheet">
        <style>body{font-family: 'Fira Sans', sans-serif; fontw-weight: 300; padding-top:2rem;padding-bottom:1rem;font-size:.93rem}h3{margin-top:2rem}.blockquote{font-size:.95rem}.table td,.table th{padding:.6rem .3rem;vertical-align:middle;font-size:.88rem}.updated{width:85px}.container .credit{margin:20px 0}.awesome{background-color:#5cb85c;color:#fff}.awesome .alert-link{color:#fff}.smiley{width:20px;height:20px}.text-awesome{color:#5cb85c}.alert{display:inline-block}.alert-link{font-weight:400}hr{margin-top:3rem;margin-bottom:.3rem}footer{font-size:.85rem}.topbar{position:fixed;top:0;left:0;right:0;border-top: 6px solid;padding-bottom:2rem;z-index: 50}.yes{border-top-color:#5cb85c}.no{border-top-color:#d9534f}.ad{text-align: center;margin-top: 2em}.footer{font-size:.85em}</style>
    </head>
    <body>
    <div class="topbar <?= (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6) ? 'yes' : 'no'); ?>"></div>
    <div class="container">
        <div class="page-header">
            <h1>Internetudbydere og IPv6</h1>
            <p class="lead">IPv6-adresse.dk kortlægger internetudbydere og deres (manglende) understøttelse af IPv6.</p>
        </div>
        <div class="alert alert-info">
            <strong>Hey, ved du noget?</strong> Jeg mangler data om internetudbydere og  deres status på IPv6. <a href="https://docs.google.com/forms/d/1L_P8SDxklgkcMkyguCUaKawNTI1dz8lza6hYBSlrmcY/viewform" target="_blank" class="btn btn-success">Indsend info</a>
        </div>
        <h3 id="ipv4">Vi er løbet tør for IPv4 adresser…</h3>
        <p>Derfor er det på tide, at internetudbyderne giver deres kunder den nye version, IPv6 adresser.<br />
            Heldigvis har nogle udbydere allerede gjort det, andre er i gang, og så er der den klassiske <em>ingen tidshorisont</em>.
        </p>
        <blockquote class="blockquote">
            <p class="m-b-0">Der er indført mange forbedringer i IPv6, men den største forskel er størrelsen af adressefeltet, som er på 128 bit mod kun 32 bit i den gamle IPv4 standard. Udvidelsen af adressefeltet giver teoretisk mulighed for op til 3,4 × 10<sup>38</sup> (340 sekstillioner) adresser, som kan sammenlignes med, at der i IPv4 kun var mulighed for omkring 4 milliarder adresser.</p>
            <footer class="blockquote-footer"><a href="https://da.wikipedia.org/wiki/IPv6" target="_blank"><cite title="Wikipedia">Wikipedia</cite></a></footer>
        </blockquote>

        <h3 id="ipv6">IPv6 hos danske internetudbyderne</h3>
        <p>Det går desværre ret langsomt med IPv6 i Danmark, det er kun et par udbydere, der tilbyder det til privatkunder. Resten tilbyder det slet ikke, eller kun til erhvervskunder.</p>

        <h3 id="check">Har jeg IPv6?</h3>
        <?php
        if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6)) {
            echo "<p class='text-awesome'>Ja, tillykke, du har IPv6!</p>";
        } else {
            echo "<p class='text-danger'>Nej, du har desværre ikke IPv6. Kontakt evt. din internetudbyder.</p>";
        }
        $query = @unserialize(file_get_contents('http://ip-api.com/php/'.$ip));
        if ($query && $query['status'] == 'success') {
            echo '<p><strong>Din udbyder:</strong> '.($query['isp'] ?? 'Unknown');
        }

        if (false === strpos(($query['isp'] ?? 'Unknown'), ($query['org'] ?? 'Unknown'))) {
            echo ' – '.$query['org'];
        }
        echo '<br><strong>Din IP adresse:</strong> '.$ip.'</p>
      <h3>Listen over internetudbydere</h3>
      <p><strong>Internetudbydere på listen:</strong> '.$stats['count']."<br>
      <strong>Internetudbydere med <span class='text-awesome'>fuld IPv6</span>:</strong> ".$stats['full_ipv6']."<br>
      Internetudbydere med <span>delvis IPv6</span>: ".$stats['some_ipv6']."<br>
      <strong>Procentdel med <span class='text-awesome'>fuld IPv6</span>:</strong> ".round($stats['full_ipv6'] / $stats['count'] * 100, 0)."%
      <p class='small'><span class='text-awesome'>Fuld IPv6</span>: Alle kunder hos udbyderen har mulighed for få IPv6.</p>";
        ?></p>

        <table class="table table-condensed">
            <thead>
            <tr>
                <th data-sort="string">Udbyder</th>
                <th data-sort="string">IPv6</th>
                <th data-sort="string">Kommentar</th>
                <th data-sort="string" class="source">Kilde</th>
                <th data-sort="string" class="updated">Opdateret</th>
            </tr>
            </thead>
            <?php
            foreach ($fullArray as $item) {
                echo renderRow($item, 'awesome', false);
            }
            foreach ($partialArray as $item) {
                echo renderRow($item, 'alert-warning');
            }
            foreach ($unsupportedArray as $item) {
                echo renderRow($item, 'alert-danger');
            }
            ?>
        </table>
        <small><strong>xDSL:</strong> Internet via telefonstikket (TDC/YouSee kobber) – ADSL, VDSL mm.</small><br>
        <small><strong>Coax:</strong> Internet via kabel-TV-signalet. Ofte leveret af YouSee, Stofa, alterntive operatør på YouSee-nettet eller en antenneforening.</small>
        <hr>
        <footer>
            <p class="float-sm-left">&copy; 2013-<?= date('Y') ?> IPv6-adresse.dk &middot; <a href="https://twitter.com/ipv6dk" target="_blank">@ipv6dk</a> &middot; <a href="mailto:ipv6@ipv6-adresse.dk">ipv6@ipv6-adresse.dk</a></p>
            <p class="float-sm-right">Et projekt af <a href="https://emilstahl.dk" target="_blank">Emil Stahl</a> &middot; <a href="https://twitter.com/emilstahl" target="_blank">@emilstahl</a></p>
        </footer>
    </div>
    <a href="https://github.com/emilstahl/ipv6"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://camo.githubusercontent.com/38ef81f8aca64bb9a64448d0d70f1308ef5341ab/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6461726b626c75655f3132313632312e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png"></a>
    </body>
    </html>
<?php
