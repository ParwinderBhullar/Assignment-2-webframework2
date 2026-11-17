# Generative AI Use Declaration — ITE5425 Mastery Assignment 2

**Student Name:** Parwinder Singh  
**Humber Student ID:** N01730928  
**Assignment:** My Art Explorer — Mastery Assignment 2  
**Date:** November 2026

## AI tools used
I used OpenAI ChatGPT and AI assistance while learning concepts, understanding the supplied code, troubleshooting issues, and reviewing the project.

## What I asked AI to help with
I asked for explanations of React components, props and state, Context API, authentication with JWT cookies, Next.js Route Handlers, MongoDB Atlas connections, and favourites APIs. I also requested help diagnosing development errors, planning API testing in Postman, and understanding the assignment requirements.

## Assistance received and how I used it
AI helped explain and troubleshoot the code. 

I configured MongoDB Atlas for my own environment, ran the user seed script, and worked through website and Postman testing and screenshot collection. I reviewed the implementation as I worked through the assignment.

## Suggestions accepted, changed, or rejected
I used the instructor's starter project and labelled code blocks rather than replacing the original public artwork features. I kept JWT sessions in HttpOnly cookies rather than browser localStorage. I kept my private MongoDB credentials and JWT secret in a local environment file instead of adding them to the submitted source ZIP. I used AI explanations and code suggestions as material to review and test, not as proof that a feature worked without testing.

## What I learned
I learned how AuthContext shares the signed-in user's information with different components, including the navigation bar, without passing the same props through many pages. I also learned how FavoritesContext calls the protected favourites API, refreshes the list after changes, and updates the displayed favourites count; MongoDB Atlas stores the records so they remain after a page refresh.

## Code I can explain
In `components/FavoriteButton.jsx`, the `artworkId` prop identifies the artwork. The component checks `favorites` from FavoritesContext to decide whether to display **Favorite** or **Saved**. When the button is clicked, it calls `toggle(artworkId)`, which sends the appropriate API request and refreshes the shared favourites state.

## Final review
I understand that the assignment requires my own verification, individual customization, and an honest disclosure of AI-generated or AI-assisted work. Before submitting, I will ensure this statement matches the code I actually kept, modified, tested, and can explain.
