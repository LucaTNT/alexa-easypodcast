const alexa = require('alexa-app');
const app = new alexa.app('easypodcast');
const EasyPodcastAPI = require('https')
const endpoint_url = 'https://www.easypodcast.it/api/v1'

const show_id = {
    "EasyApple": "1",
    "TechMind": "2",
    "Casual": "3",
    "SaggioPodcast": "4",
    "Aspherical": "5",
    "Metro": "6",
    "PausaCaffe": "7",
    "OneMoreShow": "8",
    "FuoriOnda": "9",
    "Motorcast": "10",
    "PixelClub": "11"
}

const slug = {
    "EasyApple": "easyapple",
    "TechMind": "techmind",
    "Casual": "casual",
    "SaggioPodcast": "saggiopodcast",
    "Aspherical": "aspherical",
    "Metro": "metro",
    "PausaCaffe": "pausacaffe",
    "OneMoreShow": "onemoreshow",
    "FuoriOnda": "fuorionda",
    "Motorcast": "motorcast",
    "PixelClub": "pixelclub"
}

const pronunciation = {
    "EasyApple": "isi apple",
    "TechMind": "tech mind",
    "Casual": "casual",
    "SaggioPodcast": "saggio podcast",
    "Aspherical": "asferical",
    "Metro": "metro",
    "PausaCaffe": "pausa caffè",
    "OneMoreShow": "one more show",
    "FuoriOnda": "fuori onda",
    "Motorcast": "motorcast",
    "PixelClub": "pixel club"
}

const show_display_name = {
    "EasyApple": "EasyApple",
    "TechMind": "Tech Mind",
    "Casual": "Casual",
    "SaggioPodcast": "SaggioPodcast",
    "Aspherical": "Aspherical",
    "Metro": "Metro",
    "PausaCaffe": "Pausa Caffè",
    "OneMoreShow": "One More Show",
    "FuoriOnda": "Fuori Pnda",
    "Motorcast": "Motorcast",
    "PixelClub": "Pixel Club"
}

app.pre = function(req, res, type) {
  console.log(JSON.stringify(req.data))
};

app.launch((req, res) => {
    return_response(res, "Benvenuto nella skill di isi podcast. Puoi chiedermi di riprodurre la puntata che vuoi del tuo podcast preferito. Ad esempio: Alexa, chiedi a isi podcast di riprodurre l'ultima puntata di isi apple.", "Benvenuto nella skill di EasyPodcast.\nPuoi chiedermi di riprodurre la puntata che vuoi del tuo podcast preferito. Ad esempio: Alexa, chiedi a EasyPodcast di riprodurre l'ultima puntata di EasyApple.");
});

app.customSlot("PodcastNameType", [
    {
        value: "EasyApple",
        id: "EasyApple",
        synonyms: ["easy apple", "isi apple", "si apple"]
    },
    {
        value: "Tech Mind",
        id: "TechMind",
        synonyms: ["tek mind", "tec mind", "tek maind", "tec maind", "tec mai", "tek mai"]
    },
    {
        value: "Casual",
        id: "Casual",
        synonyms: ["chesual"]
    },
    {
        value: "SaggioPodcast",
        id: "SaggioPodcast",
        synonyms: ["saggio podcast"]
    },
    {
        value: "Aspherical",
        id: "Aspherical",
        synonyms: ["asferical", "asferica"]
    },
    {
        value: "Metro",
        id: "Metro"
    },
    {
        value: "Pausa Caffè",
        id: "PausaCaffe"
    },
    {
        value: "One More Show",
        id: "OneMoreShow",
        synonyms: ["one mor show", "uan mor sciò", "one more sciò"]
    },
    {
        value: "Fuori Onda",
        id: "FuoriOnda"
    },
    {
        value: "Motorcast",
        id: "Motorcast",
        synonyms: ["motor cast"]
    },
    {
        value: "PixelClub",
        id: "PixelClub",
        synonyms: ["pixel club"]
    }]
)

function call_EasyPodcast_API(path) {
    return new Promise(function (resolve, reject) {
        EasyPodcastAPI.get(endpoint_url + path, (resp) => {
            let data = '';

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
              data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                try {
                    let API_data = JSON.parse(data);
                    console.log("JSON data: " + data)

                    if (API_data['error'] === undefined) {
                        resolve(API_data)
                    }
                    else
                    {
                        console.log('Errore riportato dalla API')
                        reject('Errore riportato dalla API')
                    }
                }
                catch (e)
                {
                    console.log('Errore chiamando API' + e)
                    reject(e)
                }
            })

        }).on("error", (err) => {
        console.log("Error: " + err.message);
        reject(err)
        });
    });
}

function get_latest_episode(show) {
    return new Promise(function (resolve, reject) {
        call_EasyPodcast_API('/show/' + slug[show] + '/lastEpisode').then(function(result){
            resolve(result)
        }, function (err) {
            reject(err)
        })
    });
}

function get_episode(show, episode_number) {
    return new Promise(function (resolve, reject) {
        call_EasyPodcast_API('/show/' + slug[show] + '/episode/' + episode_number).then(function(result){
            resolve(result)
        }, function (err) {
            reject(err)
        })
    });
}

function return_error_response(res, err, text, card_text) {
    console.log(err);
    return_response(res, text, card_text);
}

function return_response(res, text, card_text, image_small, image_large, should_end_session = true) {
    if (image_small == undefined && image_large == undefined) {
        res.say(text).shouldEndSession(should_end_session);
        if (card_text !== false) {
            card_text = (card_text !== undefined ? card_text : text);
            res.card({
                type: "Standard",
                title: "EasyPodcast",
                text: card_text,
                image: { // image is optional
                    smallImageUrl: "https://media.easypodcast.it/img/easypodcast_white600.png",
                    largeImageUrl: "https://media.easypodcast.it/img/easypodcast_white.png"
                }
            });
        }
    }
    else
    {
        console.log('small: ' + image_small + ' large: ' + image_large)
        res.say(text).shouldEndSession(should_end_session);
        if (card_text !== false) {
            res.card({
                type: "Standard",
                title: "EasyPodcast",
                text: card_text,
                image: { // image is optional
                    smallImageUrl: image_small,
                    largeImageUrl: image_large
                }
            });
        }
    }
}

function play_episode(res, json_data) {
    var episode_title = json_data["episode"]["title"]
    var play_url = json_data["episode"]["play_url"]
    var show_title = json_data["show"]["title"]
    var image_small = json_data["show"]["artwork600"]
    var image_large = json_data["show"]["artwork"]


    var stream = {
        url: play_url,
        token: play_url,
        offsetInMilliseconds: 0
    }
    res.audioPlayerPlay('REPLACE_ALL', {
        "stream": stream,
        "metadata": {
            "title": episode_title,
            "subtitle": show_title,
            "art": {
                "contentDescription": show_title,
                "sources": [{
                    "url": image_small,
                    "size": "SMALL",
                    "widthPixels": 600,
                    "heightPixels": 600
                }, {
                    "url": image_large,
                    "size": "LARGE",
                    "widthPixels": 1400,
                    "heightPixels": 1400
                }]
            }
        }
    })
}

app.intent('PlayLastEpisodeIntent', {
        dialog: {
            type: "delegate"
        },
        slots: {
            "PodcastName": "PodcastNameType"
        },
        utterances: ['{riproduci|riprodurre} {l\'ultima|l\'ultima puntata di|} {-|PodcastName}', '{-|PodcastName}']
    }, (req, res) => {
        if (req.getDialog().isStarted() || req.getDialog().isInProgress()) {
            req.getDialog().handleDialogDelegation();
        } else if (req.getDialog().isCompleted()) {
            const show_name = req.slots['PodcastName'].resolutions[0].values[0].id
            console.log(req.slots['PodcastName'].resolutions[0])
            console.log("show: " + show_name + " id: " + show_id[show_name] + " slug: " + slug[show_name])

            const episode_data = get_latest_episode(show_name)
            return episode_data.then(function(result) {
                const episode_title = result["episode"]["title"]
                const play_url = result["episode"]["play_url"]

                const text = `Riproduco l'ultima puntata di ${pronunciation[show_name]}, ${episode_title}.`
                const card_text = `Riproduco l'ultima puntata di ${show_display_name[show_name]}, ${episode_title}.`
                return_response(res, text, card_text, result["show"]["artwork600"], result["show"]["artwork"])
                play_episode(res, result)
            }, function(err) {
                const text = `C'è stato un errore cercando di riprodurre ${pronunciation[show_name]}, riprova più tardi.`
                const card_text = `C'è stato un errore cercando di riprodurre ${show_display_name[show_name]}, riprova più tardi.`
                return_error_response(res, err, text, card_text);
            })
        }
    }
);

app.intent('PlayEpisodeIntent', {
        dialog: {
            type: "delegate"
        },
        slots: {
            "PodcastName": "PodcastNameType",
            "EpisodeNumber": "AMAZON.NUMBER"
        },
        utterances: ['{riproduci|riprodurre} {la puntata|la|puntata|l\'episodio|episodio} {numero|} {-|EpisodeNumber} di {-|PodcastName}']
    }, (req, res) => {
        if (req.getDialog().isStarted() || req.getDialog().isInProgress()) {
            req.getDialog().handleDialogDelegation();
        } else if (req.getDialog().isCompleted()) {
            const show_name = req.slots['PodcastName'].resolutions[0].values[0].id
            console.log(req.slots['PodcastName'].resolutions[0])
            console.log(req.slots)
            console.log(req.slots['EpisodeNumber'])
            const episode_number = req.slot("EpisodeNumber");

            if (episode_number !== undefined)
            {
                console.log("show: " + show_name + " id: " + show_id[show_name] + " slug: " + slug[show_name] + " puntata: " + episode_number)
                const episode_data = get_episode(show_name, episode_number)

                return episode_data.then(function(result) {
                    const episode_title = result["episode"]["title"]
                    const play_url = result["episode"]["play_url"]

                    const text = `Riproduco la puntata ${episode_number} di ${pronunciation[show_name]}, ${episode_title}.`;
                    const card_text = `Riproduco la puntata ${episode_number} di ${show_display_name[show_name]}, ${episode_title}.`;
                    return_response(res, text, card_text, result["show"]["artwork600"], result["show"]["artwork"])
                    play_episode(res, result)
                }, function(err) {
                    const text = `C'è stato un errore cercando di riprodurre la puntata ${episode_number} di ${pronunciation[show_name]}, sei sicuro che esista?`;
                    return_error_response(res, err, text);
                })
            }
            else
            {
                const text = `C'è stato un errore cercando di riprodurre la puntata richiesta di ${pronunciation[show_name]}, sei sicuro che esista?`;
                const card_text = `C'è stato un errore cercando di riprodurre la puntata richiesta di ${show_display_name[show_name]}, sei sicuro che esista?`;
                return_error_response(res, "Episode number not found", text, card_text);
            }
        }
    }
);

// Thanks https://code.dblock.org/2017/02/09/alexa-skill-to-play-your-podcast.html
app.intent('AMAZON.PauseIntent', {},
    function(req, res) {
        console.log('app.AMAZON.PauseIntent');
        res.audioPlayerStop();
        res.send();
    }
);

app.intent('AMAZON.ResumeIntent', {},
  function(req, res) {
    console.log('app.AMAZON.ResumeIntent');
    if (req.context.AudioPlayer.offsetInMilliseconds > 0 && req.context.AudioPlayer.playerActivity === 'STOPPED') {
        res.audioPlayerPlayStream('REPLACE_ALL', {
          // hack: use token to remember the URL of the stream
          token: req.context.AudioPlayer.token,
          url: req.context.AudioPlayer.token,
          offsetInMilliseconds: req.context.AudioPlayer.offsetInMilliseconds
      });
    }
    res.send();
  }
);

app.intent('AMAZON.CancelIntent', {},
    function(req, res) {
        res.audioPlayerStop();
        res.send();
    }
);

app.intent('AMAZON.LoopOffIntent', {},
    function(req, res) {
        return_response(res, "La riproduzione continua dei podcast non è supportata", false)
    }
);

app.intent('AMAZON.LoopOnIntent', {},
    function(req, res) {
        return_response(res, "La riproduzione continua dei podcast non è supportata", false)
    }
);

app.intent('AMAZON.NextIntent', {},
    function(req, res) {
        return_response(res, "Per riprodurre un altra puntata, chiedimi esplicitamente quale vuoi ascoltare. Ad esempio Alexa, chiedi a isi podcast di riprodurre la puntata 42 di isi apple.", false)
    }
);

app.intent('AMAZON.PreviousIntent', {},
    function(req, res) {
        return_response(res, "Per riprodurre un altra puntata, chiedimi esplicitamente quale vuoi ascoltare. Ad esempio Alexa, chiedi a isi podcast di riprodurre la puntata 42 di isi apple.", false)
    }
);

app.intent('AMAZON.RepeatIntent', {},
    function(req, res) {
        return_response(res, "La riproduzione continua dei podcast non è supportata", false)
    }
);

app.intent('AMAZON.ShuffleOffIntent', {},
    function(req, res) {
        return_response(res, "La riproduzione casuale dei podcast non è supportata", false)
    }
);

app.intent('AMAZON.ShuffleOnIntent', {},
    function(req, res) {
        return_response(res, "La riproduzione casuale dei podcast non è supportata", false)
    }
);

app.intent('AMAZON.StartOverIntent', {},
    function(req, res) {
        if (req.context.AudioPlayer.offsetInMilliseconds > 0 && req.context.AudioPlayer.playerActivity === 'STOPPED') {
            res.audioPlayerPlayStream('REPLACE_ALL', {
              // hack: use token to remember the URL of the stream
              token: req.context.AudioPlayer.token,
              url: req.context.AudioPlayer.token,
              offsetInMilliseconds: 0
          });
        }
    }
);

module.exports = app;
