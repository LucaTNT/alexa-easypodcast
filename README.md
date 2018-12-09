# Alexa EasyPodcast

Questa è la skill Alexa di EasyPodcast, permette di riprodurre le puntate dei vari show.

Ad esempio:

* Alexa, chiedia EasyPodcat di riprodurre l'ultima puntata di EasyApple
* Alexa, chiedia EasyPodcat di riprodurre la puntata 42 di SaggioPodcast

## Tech stuff
La skill è sviluppata in NodeJS utilizzando [alexa-app](https://github.com/alexa-js/alexa-app) ed è eseguita in ambiente AWS Lambda. Viene utilizzato [apex](http://apex.run/) per il deploy su AWS e npm per la gestione delle dipendenze.

Per il deploy bisogna inserire l'ARN del ruolo per Lambda in `project.json`, che su questo repository è vuoto.
