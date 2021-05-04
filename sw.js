"use strict";

const cache = 'archivos-v1';

// Archivos que se precargan
caches.open(cache).then(cache =>{
        cache.addAll(['index.html','assets/js/codigo.js']);
})

self.addEventListener('fetch',e=>{
    e.respondWith(
        caches.match(e.request)
          .then(function(response) {
            // Respuesta desde cache
            if (response) {
              return response;
            }
            
            // agregar el archivo a la cache
            caches.open(cache).then(cache =>{
                cache.add(e.request);
            });
            // Responder con el archivo de red
            return fetch(e.request);

          }
        )
      );
})

