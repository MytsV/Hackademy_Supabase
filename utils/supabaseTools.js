const tableName = 'profiles';
const columns = 'phone, first_name, last_name, country, city, doc_url';
const idColumn = 'id';

const bucketName = 'id_photos';

export async function getProfileDatabase({supabase, userId}) {
    let { data, error, status } = await supabase
                .from(tableName)
                .select(columns)
                .eq(idColumn, userId)
                .single();

    if (error && status !== 406) {
        throw error;
    }

    return data;
}

export async function updateProfileDatabase({supabase, form, userId}) {
    const updates = {
        id: userId,
        ...form,
        updated_at: new Date(),
    }

    let { error } = await supabase.from('profiles').upsert(updates, {
        returning: 'minimal',
    })
 
    if (error) {
        throw error
    }
}

export async function getImageUrl({supabase, path}) {
    try {
        const { data, error } = await supabase.storage.from(bucketName).download(path);
        if (error) {
            throw error;
        }
        return URL.createObjectURL(data);
    } catch (error) {
        console.log('Error downloading image: ', error.message);
        return null;
    }
}

export async function uploadImage({supabase, filePath, file}) {

    console.log('uploading');

    let { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file);

    if (uploadError) {
        throw uploadError;
    }
}

