from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    send_file
)

import os

from config import DOWNLOAD_FOLDER

from services.youtube_service import (
    search_videos,
    get_audio_stream,
    download_mp3
)

app = Flask(__name__)

os.makedirs(
    DOWNLOAD_FOLDER,
    exist_ok=True
)


@app.route("/")
def home():

    return render_template(
        "index.html"
    )


@app.route("/search")
def search():

    query = request.args.get("q")

    videos = search_videos(query)

    return jsonify(videos)


@app.route("/play/<video_id>")
def play(video_id):

    audio_url = get_audio_stream(
        video_id
    )

    return jsonify({
        "audio_url": audio_url
    })


@app.route("/download/<video_id>")
def download(video_id):
    filepath = download_mp3(
        video_id,
        DOWNLOAD_FOLDER
    )

    return send_file(
        filepath,
        as_attachment=True
    )
    
    
if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000
    )