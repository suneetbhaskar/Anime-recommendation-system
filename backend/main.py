# Pandas and Numpy for handling and interacting with dataframes
import pandas as pd
import numpy as np

# PyArrow for importing .parquet files
import pyarrow 
import json

# requests for requesting data from MAL API
import requests ,os

# PyMongo for interacting with MongoDB Database
from pymongo import MongoClient

# FastAPI for creating Backend API
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI




anime = pd.read_parquet("anime.parquet")
lfinal = pd.read_parquet('lfinal.parquet')
user_similarity_scores_df = pd.read_parquet('user_similarity_scores.parquet')
genre_similarity_scores_df = pd.read_parquet('genre_similarity_scores_df.parquet')

'''
Connecting to MongoDB and Uploading Anime Data
that will be used to provide name suggestions
or other required info to the user
'''
client = MongoClient('mongodb://anime_recommender:27017/')
db = client["animeDB"]
collection = db["animeDataCollection"]
collection.insert_many(anime.to_dict('records'))
client_id = '44031a8faef31736efaac4f5e2516fbe'

def genre_based_recommendation(anime_id):
    '''
    This functions takes anime_id and suggesets 27 anime_id(s) that are most 
    similar based on genre based cosine similarity by sorting the in descending order
    '''
    similarity_scores = genre_similarity_scores_df[anime_id]
    recommended_animes = similarity_scores.sort_values(ascending=False)[0:]
    return recommended_animes.head(18).index.tolist()

def user_based_recommendation(anime_id):
    '''
    This functions takes anime_id and suggesets 27 anime_id(s) that are most 
    similar based on user based cosine similarity by sorting the in descending order
    '''
    index = np.where(lfinal.index==anime_id)[0][0]
    similar_items = sorted(list(enumerate(user_similarity_scores_df[index])),key=lambda x:x[1],reverse=True)[1:50]
    data = []
    for i in similar_items:
        temp_df = anime[anime['anime_id'] == lfinal.index[i[0]]]
        anime_id = temp_df.drop_duplicates('anime_id')['anime_id'].values[0]
        data.append(anime_id)
    return data[:18]

def get_anime_info(anime_id, client_id=client_id):
    '''
    This function takes anime_id and fetches detailed information about the 
    anime such as synopsis, score, type, picture from from MAL API and then 
    fetches the genre from the Database, combines them and returns the json
    to the calling funtion
    '''
    base_url = f"https://api.myanimelist.net/v2/anime/{anime_id}"
    params = {
        "fields": "synopsis,main_picture,mean,media_type",
    }
    headers = {
        "X-MAL-CLIENT-ID": client_id
    }
    try:   
        response = requests.get(base_url, params=params, headers=headers)
        if response.status_code == 200:
            data = response.json()
            if data:
                genre_info = get_genre(anime_id)
                if "genres" in genre_info:
                    data["genres"] = genre_info["genres"]
                else:
                    data["genre_error"] = genre_info["error"]
                return data
            else:
                print(f"No results found for anime ID '{anime_id}'.")
        else:
            print(f"Failed to fetch data from MyAnimeList API. Status code: {response.status_code}")
            print(response.text) 
    except requests.RequestException as e:
        print(f"An error occurred: {e}")

def get_recommendation_user_based(anime_id):
    '''
    This function takes in anime_id and checks whether
    user based recommendation can be provided by cross-referencing
    the anime_id with lfinal dataframe, if the anime_id is present
    in the dataframe then user_based_recommendation() is invoked 
    and recommended anime_id list is returned, otherwise if the 
    anime_id is not present in the dataframe then only genre based 
    recommendation can be provided, hence genre_based_recommendation() 
    is invoked, in either case the returned anime_id list is is forwarded
    to get_anime_info() to receive detailed info on each which is then 
    combined and returned to the calling function 
    '''
    if anime_id in lfinal.index:
        recommend_ids = user_based_recommendation(anime_id)
    else:
        recommend_ids = genre_based_recommendation(anime_id)
    recommend_data = []
    for id in recommend_ids:
        recommend_data.append(get_anime_info(id))
    return recommend_data

def get_genre(anime_id):
    '''
    This function fetches and returns genre of an Anime 
    from the Database to the calling function
    '''
    document = collection.find_one({"anime_id": int(anime_id)})
    if document:
        genre = document.get("genre")
        if genre:
            # Splits the genre string into a list of genres
            genre_list = [g.strip() for g in genre.split(',')]
            return {"anime_id": anime_id, "genres": genre_list}
        else:
            return {"anime_id": anime_id, "error": "Genre not found"}
    else:
        return {"anime_id": anime_id, "error": "Anime not found"}



def get_recommendation_genre_based(anime_id):
    '''
    This function takes in anime_id as input and then
    fetches the recommended anime_id list from 
    gnere_based_recommendation() and forwards the
    anime_id list to get_anime_info() to receive detailed info 
    on each which is then combined and returned to the calling function  
    '''
    recommend_ids = genre_based_recommendation(anime_id)
    recommend_data = []
    for id in recommend_ids:
        recommend_data.append(get_anime_info(id))
    return recommend_data



app = FastAPI() 


'''
CORS middleware pass-through
'''
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
)





'''
API Endpoints 
'''
@app.get("/search/{anime_name_partial}")
async def search_anime(anime_name_partial: str):
    '''
    This Function is invoked when user inputs some text into the search bar and 
    this returns possible Anime name matches from the Database to the string 
    that is being entered by the user
    '''
    anime_name_partial = anime_name_partial.lower()
    pattern = '^' + anime_name_partial
    cursor = collection.find({'name': {'$regex': pattern, '$options': 'i'}})
    matches = [{'name': doc['name'], 'id': doc['anime_id']} for doc in cursor]
    return {"anime_matches": matches}


@app.get("/recommend/user/{anime_id}")
async def read_item(anime_id: int):
    '''
    This Functions is invoked when the user has selected the 
    User based recommendation and has selected any anime, this
    funtion returns value received by the get_recommendation_user_based()
    '''
    return get_recommendation_user_based(anime_id)


@app.get("/recommend/genre/{anime_id}")
async def read_item(anime_id: int):
    '''
    This Functions is invoked when the user has selected the 
    Genre based recommendation and has selected any anime, this
    funtion returns value received by the get_recommendation_genre_based()
    '''
    return get_recommendation_genre_based(anime_id)

