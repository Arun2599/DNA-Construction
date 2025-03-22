import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideClientHydration } from '@angular/platform-browser';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideAuth(() => getAuth()),
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: "AIzaSyB_AaXzZc0fTZGDiOTIEjAFMM1YcjmdXtc",
    authDomain: "dna-constructions-architects.firebaseapp.com",
    projectId: "dna-constructions-architects",
    storageBucket: "dna-constructions-architects.firebasestorage.app",
    messagingSenderId: "149432733180",
    appId: "1:149432733180:web:3e9a25f0dbc01f0a37b679",
    measurementId: "G-QKS506B0B8"
      })
    ),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ],
};
