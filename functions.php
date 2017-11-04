<?php 

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


?>