import { db } from './firebase';
import { collection, addDoc, getDocs, doc, setDoc, onSnapshot, query, orderBy, deleteDoc, getDoc } from 'firebase/firestore';

const STORAGE_KEY = 'etamu_data'; // Deprecated but kept for reference
const SETTINGS_KEY = 'etamu_settings'; // Deprecated

// === GUEST ENTRIES ===

export const saveGuestEntry = async (entry) => {
    try {
        const docRef = await addDoc(collection(db, "guests"), {
            ...entry,
            timestamp: new Date().toISOString()
        });
        return { ...entry, id: docRef.id };
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
    }
};

// Real-time subscription
export const subscribeToGuests = (callback) => {
    const q = query(collection(db, "guests"), orderBy("timestamp", "desc"));
    return onSnapshot(q, (querySnapshot) => {
        const guests = [];
        querySnapshot.forEach((doc) => {
            guests.push({ id: doc.id, ...doc.data() });
        });
        callback(guests);
    });
};

// Fallback for one-time fetch
export const getGuestEntries = async () => {
    const q = query(collection(db, "guests"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const deleteGuestEntry = async (id) => {
    await deleteDoc(doc(db, "guests", id));
};

// === APP SETTINGS ===

const DEFAULT_SETTINGS = {
    schoolName: 'MAN 2 Kota Tidore Kepulauan',
    unitName: 'PMR (Palang Merah Remaja)',
    adminPassword: 'admin',
    visi: '',
    misi: '',
    logo: '',
    slides: ['', '', '', '', '']
};

export const subscribeToSettings = (callback) => {
    return onSnapshot(doc(db, "settings", "config"), (doc) => {
        if (doc.exists()) {
            callback({ ...DEFAULT_SETTINGS, ...doc.data() });
        } else {
            // Create default if not exists
            setDoc(doc.ref, DEFAULT_SETTINGS);
            callback(DEFAULT_SETTINGS);
        }
    });
};

export const getAppSettings = async () => {
    const docRef = doc(db, "settings", "config");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { ...DEFAULT_SETTINGS, ...docSnap.data() };
    } else {
        await setDoc(docRef, DEFAULT_SETTINGS);
        return DEFAULT_SETTINGS;
    }
};

export const updateAppSettings = async (newSettings) => {
    // Merging is handled by setDoc with merge:true or just overwrite? Use merge
    await setDoc(doc(db, "settings", "config"), newSettings, { merge: true });
};
