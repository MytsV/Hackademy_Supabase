import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { getProfileDatabase, updateProfileDatabase } from '../utils/supabaseTools';
import { Button, Input, IconMail, IconMap, IconUser, IconPhone, Typography, Space } from '@supabase/ui';
import Avatar from './Avatar';

const iconSize = 21;
const strokeColor = '#666666';

export default function Account({ session }) {
    const [form, setForm] = useState({
        first_name: null,
        last_name: null,
        phone: null,
        country: null,
        city: null,
        doc_url: ''
    });

    const [loading, setLoading] = useState(true);

    const updateField = e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    useEffect(() => {
        waitForApiAction(getProfile);
    }, [session]);

    async function waitForApiAction(action) {
        try {
            setLoading(true);
            await action();
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    function getUserId() {
        const user = supabase.auth.user();
        return user.id;
    }

    async function getProfile() {
        const userId = getUserId();

        let data = await getProfileDatabase({ supabase, userId });

        if (data) {
            setForm(data);
        }
    }

    async function updateProfile() {
        const userId = getUserId();

        await updateProfileDatabase({ supabase, userId, form });
    }

    function getValue(value) {
        return form[value] || '';
    }

    function onUpload(url) {
        setForm({
            ...form,
            doc_url: url
        });
        updateProfile();
    }

    return (
        <div className="form-widget">
            <Typography.Text>Upload a photo of your ID card</Typography.Text>
            <Avatar
                url={form['doc_url']}
                size={150}
                onUpload={onUpload}
            />
            <Input id="email" type="email" label="Email address" value={session.user.email} icon={<IconMail size={iconSize} stroke={strokeColor} />} disabled />
            <br />
            <Input id="first-name" name="first_name" type="text" label="First Name" value={getValue("first_name")} onChange={updateField} icon={<IconUser size={iconSize} stroke={strokeColor} />} />
            <br />
            <Input id="last-name" name="last_name" type="text" label="Last Name" value={getValue("last_name")} onChange={updateField} icon={<IconUser size={iconSize} stroke={strokeColor} />} />
            <br />
            <Input id="phone" name="phone" type="text" label="Phone" value={getValue("phone")} onChange={updateField} icon={<IconPhone size={iconSize} stroke={strokeColor} />} />
            <br />
            <Input id="country" name="country" type="text" label="Country" value={getValue("country")} onChange={updateField} icon={<IconMap size={iconSize} stroke={strokeColor} />} />
            <br />
            <Input id="city" name="city" type="text" label="City" value={getValue("city")} onChange={updateField} icon={<IconMap size={iconSize} stroke={strokeColor} />} />
            <br />
            <Button disabled={loading} onClick={() => waitForApiAction(updateProfile)} block>{loading ? 'Loading...' : 'Update'}</Button>
            <br />
            <Button onClick={() => supabase.auth.signOut()} block>Sign out</Button>
        </div>
    )
}