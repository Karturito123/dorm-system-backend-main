import { Inject, Injectable } from '@nestjs/common';
import { app, auth } from 'firebase-admin';
@Injectable()
export class FirebaseService {
  auth: auth.Auth;
  db: FirebaseFirestore.Firestore;

  constructor(@Inject('FIREBASE_APP') private firebaseApp: app.App) {
    this.auth = this.firebaseApp.auth();
    this.db = firebaseApp.firestore();
  }

  initCollection(collection: string): FirebaseFirestore.CollectionReference {
    return this.db.collection(collection);
  }
}
