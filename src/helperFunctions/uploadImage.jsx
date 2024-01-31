import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import the necessary Storage functions

const uploadImage = async (imageFile, setErrorMsg) => {
  try {
    if (!imageFile) {
      return null;
    }

    const storage = getStorage();
    const storageRef = ref(storage, `images/${imageFile.name}`);
    const uploadTask = uploadBytes(storageRef, imageFile);
    await uploadTask;
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    setErrorMsg('Error uploading image.');
    return null;
  }
};

export default uploadImage;
