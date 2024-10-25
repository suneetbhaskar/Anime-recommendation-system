# Anime-recommendation-system
Overview
Welcome to the Anime Recommendation System! This project aims to assist anime enthusiasts in discovering new and exciting anime titles tailored to their preferences. By combining data from MyAnimeList with a custom-trained recommendation model, our system employs both genre-based and user-based recommendation strategies. This fusion enhances the accuracy and versatility of our recommendations. Additionally, the integration of the MyAnimeList API enriches the user experience by providing detailed information about each recommended anime.

Anime Recommendation System

Getting Started
Prerequisites
Install Docker: Ensure Docker is installed on your system.
Install Git LFS: If not installed, Git LFS (Large File Storage) is necessary for cloning the repository and its large files.
Installation Steps
Clone the Repository: Use Git LFS to clone this repository to your local machine.


git lfs clone https://github.com/ishimanshu/AnimeRecommendation.git
Obtain a MyAnimeList API client ID and create an env var in root

Launch the application:


docker compose up
Open your browser and go to localhost:4000.

Limitations
While the Anime Recommendation System provides valuable insights into discovering new anime titles, it's important to be aware of the following limitations:

Limited Database Update: The anime database is updated only until 2020. Newer titles released after this year may not be included in recommendations.

Overlap Between Recommendations: In cases where user-based recommendations are uncertain, both user-based and genre-based recommendations may yield similar results.

User-Based Recommendation Criteria: The user-based recommendation model considers users with a minimum of 150 or more anime views for personalized suggestions.

Frequently Asked Questions
Why build an anime recommendation system?
Anime is a diverse form of entertainment with a vast global fanbase. This system was created to help anime enthusiasts navigate this vast landscape and discover new favorites.

What makes this recommendation system special?
Hybrid Approach: Fusing genre-based and user-based recommendations results in precise and varied anime suggestions.

MyAnimeList API Integration: Seamless integration with the MyAnimeList API provides comprehensive information about each recommended anime.

Additional Information
Resources Used (Third-Party)
MyAnimeList Dataset:https://www.kaggle.com/datasets/CooperUnion/anime-recommendations-database
MAL API:
Software Components
Front-end: React.JS, CSS, HTML
Back-end: Python, FastAPI (Uvicorn)
Database: MongoDB
Feedback and Suggestions
We welcome your feedback and suggestions! If you encounter any issues or have ideas for improvement, please let us know. Your input is valuable in enhancing the Anime Recommendation System.
