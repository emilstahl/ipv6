<?php
require_once("functions.php");

$ip = $_SERVER['REMOTE_ADDR'];

// Load in data from JSON
$data = json_decode(file_get_contents('data.json'));

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
?>
<!DOCTYPE html>
<html lang="da">
<head>
    <meta charset="utf-8">
    <script>
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
        ga('create', 'UA-44452629-1', 'auto');
        ga('require', 'displayfeatures');
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
    <meta property="og:image" content="https://ipv6-adresse.dk/resources/icon.png"/>
    <link rel="stylesheet" href="resources/bootstrap.min.css">
    <style>body{font-family:'Fira Sans',sans-serif;font-weight:300;padding-top:2rem;padding-bottom:1rem;font-size:.93rem}@font-face {font-family: 'Fira Sans';font-style:normal;font-weight:300;src:local('Fira Sans Light'),local('FiraSans-Light'),url('/resources/fira-sans-v8-latin-300.woff2') format('woff2'), url('/resources/fira-sans-v8-latin-300.woff') format('woff')}.awesome,.awesome .alert-link{color:#fff}.fork,.topbar{top:0;right:0}h3{margin-top:2rem}.blockquote{font-size:.95rem}.table td,.table th{padding:.6rem .3rem;vertical-align:middle;font-size:.88rem}.updated{width:85px}.container .credit{margin:20px 0}.awesome{background-color:#5cb85c}.smiley{width:20px;height:20px}.text-awesome{color:#5cb85c}.alert{display:inline-block}.alert-link{font-weight:400}hr{margin-top:3rem;margin-bottom:.3rem}.topbar{position:fixed;left:0;border-top:6px solid;padding-bottom:2rem;z-index:50}.yes{border-top-color:#5cb85c}.no{border-top-color:#d9534f}.fork{position:absolute;border:0;width:149px;height:149px}@media (max-width:700px){.fork{display:none}}footer{font-size:.85em}</style>
</head>
<body>
<div class="topbar"></div>
<div class="container">
    <div class="page-header">
        <h1>Internetudbydere og IPv6</h1>
        <p class="lead">IPv6-adresse.dk kortlægger internetudbydere og deres (manglende) understøttelse af IPv6.</p>
    </div>
    <div class="alert alert-info">
        <strong>Hey, ved du noget?</strong> Jeg mangler data om internetudbydere og  deres status på IPv6. <a href="https://github.com/emilstahl/ipv6" target="_blank" class="btn btn-success">Hjælp på GitHub</a><br><small>Er du ikke vild med GitHub? Så send en mail eller skriv et tweet i stedet :).</small>
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
    <p id="ipVersionText">Vi undersøger sagen, dette kræver at JavaScript er slået til!</p>
    <strong>Din udbyder: <span id="ispName"></span></strong><br>
    <strong>Din IP adresse:</strong> <span id="ipaddress"></span></p>

  <?php echo '<h3>Listen over internetudbydere</h3>
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
<a href="https://github.com/emilstahl/ipv6" target="_blank"><img class="fork" src="resources/fork-me.png" alt="Fork me on GitHub"></a>

<script>
    (function(){
        function isIPv6(ip) {
            var ipv6Regex = /^((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4}))*::((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4}))*|((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4})){7}$/gi;
            return ipv6Regex.test(ip);
        }

        window.updateIPData = function updateIPData(data) {
            var isV6 = isIPv6(data.address);
            document.getElementById('ipVersionText').innerHTML = isV6 ? "Ja, tillykke, du har IPv6!" : "Nej, du har desværre ikke IPv6. Kontakt evt. din internetudbyder.";
            document.getElementById('ipVersionText').classList.add(isV6 ? 'text-awesome' : 'text-danger');
            document.getElementById('ispName').innerHTML = data.isp_name;
            document.getElementById('ipaddress').innerHTML = data.address;
            document.querySelector('.topbar').classList.add(isV6 ? 'yes' : 'no');
        }

        var script = document.createElement('script');
        script.src = 'https://v4v6.ipv6-test.com/json/addrinfo.php?callback=updateIPData'

        document.getElementsByTagName('head')[0].appendChild(script);
    })()
</script>

</body>
</html>
