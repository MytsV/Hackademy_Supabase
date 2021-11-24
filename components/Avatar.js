import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import styles from '../styles/Avatar.module.css'
import { getImageUrl, uploadImage } from '../utils/supabaseTools'

export default function Avatar({ url, onUpload }) {
    const [avatarUrl, setImage] = useState(null)
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        if (url) {
            downloadImage(url);
        } 
    }, [url])

    async function downloadImage(path) {
        const url = await getImageUrl({supabase, path});
        setImage(url);
    }

    async function uploadImageFile(event) {
        try {
            setUploading(true)

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.')
            }

            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            console.log(filePath);

            await uploadImage({filePath, supabase, file});

            onUpload(filePath)
        } catch (error) {
            alert(error.message)
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className={styles.container}>
            {avatarUrl ? (
                <img
                    src={avatarUrl}
                    alt="Document"
                    className={styles.image}
                />
            ) : (
                <div className={styles.noImage} />
            )}
            <div>
                <label className="sbui-btn sbui-btn-primary" htmlFor="single">
                    {uploading ? 'Uploading...' : 'Upload'}
                </label>
                <input
                    className={styles.inputFile}
                    type="file"
                    id="single"
                    accept="image/*"
                    onChange={uploadImageFile}
                    disabled={uploading}
                />
            </div>
        </div>
    )
}