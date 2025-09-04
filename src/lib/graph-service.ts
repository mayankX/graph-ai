import { firestore } from './firebase';
import { collection, addDoc, getDoc, doc } from 'firebase/firestore';

const GRAPHS_COLLECTION = 'graphs';

/**
 * Saves a DOT graph string to Firestore.
 * @param dotCode The string of the DOT graph to save.
 * @returns The unique ID of the saved graph document.
 */
export async function saveGraph(dotCode: string): Promise<string> {
  try {
    const docRef = await addDoc(collection(firestore, GRAPHS_COLLECTION), {
      dot: dotCode,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw new Error("Could not save graph to the database.");
  }
}

/**
 * Retrieves a graph from Firestore by its ID.
 * @param id The unique ID of the graph document.
 *returns The DOT graph string or null if not found.
 */
export async function getGraph(id: string): Promise<string | null> {
  try {
    const docRef = doc(firestore, GRAPHS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data().dot;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    throw new Error("Could not retrieve graph from the database.");
  }
}
