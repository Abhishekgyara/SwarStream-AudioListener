import yt_dlp
import os

FFMPEG_PATH = r"C:\Users\Abhishek Bhan\Downloads\Audio_yt\ffmpeg-8.1.1-essentials_build\bin"


def search_videos(query):

    ydl_opts = {
        "quiet": True,
        "extract_flat": True
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        result = ydl.extract_info(
            f"ytsearch10:{query}",
            download=False
        )

    videos = []

    for video in result["entries"]:
        videos.append({
            "id": video["id"],
            "title": video["title"],
            "url": f"https://www.youtube.com/watch?v={video['id']}"
        })

    return videos


def get_audio_stream(video_id):

    url = f"https://www.youtube.com/watch?v={video_id}"

    ydl_opts = {
        "format": "bestaudio",
        "quiet": True
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(
            url,
            download=False
        )

    return info["url"]


def download_mp3(video_id, download_folder):

    url = f"https://www.youtube.com/watch?v={video_id}"

    ydl_opts = {
        "format": "bestaudio/best",

        "ffmpeg_location": FFMPEG_PATH,

        "outtmpl": os.path.join(
            download_folder,
            "%(title).100s.%(ext)s"
        ),

        "windowsfilenames": True,

        "noplaylist": True,

        "postprocessors": [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
            "preferredquality": "192"
        }]
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:

        info = ydl.extract_info(
            url,
            download=True
        )

        downloaded_file = ydl.prepare_filename(info)

    mp3_file = os.path.splitext(downloaded_file)[0] + ".mp3"

    return mp3_file