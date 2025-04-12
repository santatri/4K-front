<?php
  $dossier = 'node_modules';
  $dir_iterator = new RecursiveDirectoryIterator($dossier);
  $iterator = new RecursiveIteratorIterator($dir_iterator, RecursiveIteratorIterator::CHILD_FIRST);


  // On supprime chaque dossier et chaque fichier	du dossier cible
  $i = 0;
  foreach($iterator as $fichier){
     $fichier->isDir() ? rmdir($fichier) : unlink($fichier);
     if($fichier->isDir())
      echo $fichier." ".$i."<br>";
  }

  // On supprime le dossier cible
  rmdir($dossier);
?>
