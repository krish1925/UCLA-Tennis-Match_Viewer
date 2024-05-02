import { collection, addDoc, query, where, getDoc, getDocs, updateDoc, doc, arrayUnion } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import storage functions
import { db, storage } from '../services/initializeFirebase.js'; // Ensure storage is exported from initializeFirebase.js

async function uploadMatch(matchName, videoId, pointsJson, pdfFile, clientTeam, opponentTeam) {
  if (!matchName || !videoId || !clientTeam || !opponentTeam) {
    console.error("All fields are required.");
    return; // Exit the function if any field is empty
  }

  try {
    let pdfUrl = null;
    if (pdfFile) {
      // First, upload the PDF to Firebase Storage
      const pdfRef = ref(storage, `match-pdfs/${pdfFile.name}`);
      const snapshot = await uploadBytes(pdfRef, pdfFile);
      pdfUrl = await getDownloadURL(snapshot.ref);
    }

    // untagged matches
    let published = true;
    if (pointsJson === null) published = false;

    // Then, save the match data along with the PDF URL to Firestore
    const docRef = await addDoc(collection(db, "matches"), {
      name: matchName,
      videoId: videoId,
      points: pointsJson? pointsJson : [],
      pdfUrl: pdfUrl,
      clientTeam,
      opponentTeam,
      published
    });
    console.log("Match Document written with ID: ", docRef.id);
    
  } catch (e) {
    console.error("Error adding Match Document: ", e);
  }
}

async function uploadTeam(teamName, logoFile) {
  if (!teamName || !logoFile) {
    console.error("All fields are required.");
    return; // Exit the function if any field is empty
  }

  try {
    let logoUrl = null;
    if (logoFile) {
      // First, upload the PNG/JPG to Firebase Storage
      const logoRef = ref(storage, `logos/${logoFile.name}`);
      const snapshot = await uploadBytes(logoRef, logoFile);
      logoUrl = await getDownloadURL(snapshot.ref);
    }

    // Then, save the match data along with the Logo URL to Firestore
    const mens = teamName + " (M)";
    const womens = teamName + " (W)";
    const docRefM = await addDoc(collection(db, "teams"), {
      name: mens,
      logoUrl: logoUrl,
      players: []
    });
    const docRefW = await addDoc(collection(db, "teams"), {
      name: womens,
      logoUrl: logoUrl,
      players: []
    });
    console.log("Team Document(M) written with ID: ", docRefM.id, " and (W): ", docRefW.id);
    
  } catch (e) {
    console.error("Error adding Team Document: ", e);
  }
}

async function uploadPlayer(playerName, teamName) {
  if (!playerName || !teamName) {
    console.error("All fields are required.");
    return; // Exit the function if any field is empty
  }

  try {
    // Check if the team exists
    const teamRef = collection(db, 'teams');
    const teamQuery = query(teamRef, where('name', '==', teamName));
    const teamSnapshot = await getDocs(teamQuery);

    if (teamSnapshot.empty) {
      console.log("Team does not exist");
      return;
    }

    // Get the document reference
    const teamDoc = doc(db, 'teams', teamSnapshot.docs[0].id);

    // Check if the 'players' field exists
    const teamData = (await getDoc(teamDoc)).data();
    if (!teamData.players) {
      // If 'players' field doesn't exist, create it and initialize it as an array
      // backwards support for old storage schema
      await updateDoc(teamDoc, { players: [playerName] });
    } else {
      // If 'players' field exists, append the playerName to the array
      await updateDoc(teamDoc, { players: arrayUnion(playerName) });
    }
  } catch (e) {
    console.error("Error adding Player Field: ", e);
  }
}

export { uploadMatch, uploadTeam, uploadPlayer };
