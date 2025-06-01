"use client";
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw } from 'lucide-react'
import React, { useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic';
import Cookies from 'js-cookie';
import { author_service } from '@/context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast';


const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });


const blogCategories = [
    "Technology",
    "Health",
    "Finance",
    "Lifestyle",
    "Travel",
    "Food",
    "Education",
    "Entertainment",
    "Sports",
];

const AddBlog = () => {



    const editor = useRef(null);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        image: null,
        blogcontent: '',
    });

    const handleInputChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleFileChange = (e: any) => {
        const file = e.target.files[0];
        setFormData({ ...formData, image: file });
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('category', formData.category);
        formDataToSend.append('blogcontent', formData.blogcontent);

        if (formData.image) {
            formDataToSend.append('file', formData.image);
        }

        try {
            const token = Cookies.get('token');
            const { data } = await axios.post(`${author_service}/api/v1/blog/new`, formDataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            toast.success(data.message);
            setFormData({
                title: '',
                description: '',
                category: '',
                image: null,
                blogcontent: '',
            });
            setLoading(false);
            setContent('');

        } catch (error) {
            toast.error("Blog Creation Failed");
            console.error(error);
            setLoading(false);
        }

    }

    const [aiTitle, setAiTitle] = useState(false);
  const aiTitleResponse = async () => {
    try {
      setAiTitle(true);
      const { data } = await axios.post(`${author_service}/api/v1/ai/title`, {
        text: formData.title,
      });
      setFormData({ ...formData, title: data });
    } catch (error) {
      toast.error("Problem while fetching from ai");
      console.log(error);
    } finally {
      setAiTitle(false);
    }
  };

    const config = useMemo(() => ({
        readonly: false,
        placeholder: "Start writing your blog content here...",
    }), []);

    return (
        <div className='max-w-4xl mx-auto p-6'>
            <Card>
                <CardHeader>
                    <h2 className="text-2xl font-bold">Add New Blog</h2>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <Label>Title</Label>
                        <div className="flex justify-center items-center gap-2">
                            <Input name='title' value={formData.title || ""} onChange={handleInputChange} className={aiTitle?"animate-pulse placeholder: opacity-60" : ""} placeholder='Enter Blog Title ..' required />
                            {formData.title ===""? "" : <Button type='button' onClick={aiTitleResponse} disabled={aiTitle}><RefreshCw className={aiTitle?"animate-spin": ""}/></Button>}
                        </div>
                        <Label>Description</Label>
                        <div className="flex justify-center items-center gap-2">
                            <Input name='description' value={formData.description || ""} onChange={handleInputChange} placeholder='Enter Blog Description ..' required />
                            <Button type='button'><RefreshCw /></Button>
                        </div>

                        <Label>Category</Label>
                        <Select onValueChange={(value: any) => setFormData({ ...formData, category: value })}>
                            <SelectTrigger>
                                <SelectValue placeholder={formData.category || "Select Category"} />
                            </SelectTrigger>
                            <SelectContent>
                                {blogCategories.map((e, i) => (
                                    <SelectItem key={i} value={e}>{e}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div >
                            <Label>Image Upload</Label>
                            <Input type='file' name='image' accept='image/*' onChange={handleFileChange} />
                        </div>

                        <div className="">
                            <Label>Blog Content</Label>
                            <div className="flext justify-between iteems-center mb-2">
                                <p className="text-sm text-muted-foreground">
                                    Paste your blog content here. You can use Richtext formatting. Please add image after improving your grammer
                                </p>
                                <Button type='button' size={"sm"}><RefreshCw size={16} /> <span className='ml-2'>Fix Grammer</span></Button>
                            </div>
                            <JoditEditor ref={editor} value={content} config={config} tabIndex={1} onBlur={(newContent) => { setContent(newContent); setFormData({...formData, blogcontent: newContent}) }} />
                        </div>
                        <Button type='submit' className='w-full mt-4' disabled={loading}> {loading? "Publishing .." : "Publish"}</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default AddBlog
