import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Client, Databases, Storage, ID } from 'appwrite';
import { Upload, Package, DollarSign, Phone, MapPin, User, Tag, CheckSquare, Image, Clock } from 'lucide-react';

// Initialize Appwrite
const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const databases = new Databases(client);
const storage = new Storage(client);

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const BUCKET_ID = "6856b1b200278223aed4";

const UploadProduct = () => {
  const { user, isLoaded } = useUser();

  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    condition: '',
    contactNumber: '',
    sellerName: '',
    address: '',
    price: '',
    negotiable: false,
    images: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]);

  const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Automotive', 'Toys', 'Health & Beauty', 'Furniture', 'Other'];
  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

  useEffect(() => {
    if (user && !formData.sellerName) {
      setFormData(prev => ({
        ...prev,
        sellerName: user.firstName && user.lastName 
          ? `${user.firstName} ${user.lastName}` 
          : user.username || user.emailAddresses[0]?.emailAddress || ''
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploadingImages(true);
    const newImageUrls = [];
    const newPreviewUrls = [];

    try {
      for (const file of files) {
        const previewUrl = URL.createObjectURL(file);
        newPreviewUrls.push(previewUrl);

        const response = await storage.createFile(
          BUCKET_ID,
          ID.unique(),
          file
        );

        const fileUrl = storage.getFileView(BUCKET_ID, response.$id);
        newImageUrls.push(fileUrl.toString());
      }

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImageUrls]
      }));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);

    } catch (error) {
      console.error('Error uploading images:', error);
      setSubmitMessage('Failed to upload images. Please try again.');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const required = ['productName', 'category', 'condition', 'contactNumber', 'sellerName', 'address', 'price'];
    const missing = required.filter(field => !formData[field]);

    if (missing.length > 0) {
      setSubmitMessage(`Please fill in required fields: ${missing.join(', ')}`);
      return false;
    }

    if (isNaN(formData.contactNumber) || formData.contactNumber.length < 10) {
      setSubmitMessage('Please enter a valid contact number (at least 10 digits)');
      return false;
    }

    if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      setSubmitMessage('Please enter a valid price');
      return false;
    }

    if (!user) {
      setSubmitMessage('You must be logged in to upload products');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          productName: formData.productName,
          category: formData.category,
          condition: formData.condition,
          contactNumber: formData.contactNumber,
          sellerName: formData.sellerName,
          address: formData.address,
          price: parseFloat(formData.price),
          negotiable: formData.negotiable,
          images: formData.images,
          createdAt: new Date().toISOString(),
          userId: user.id,
          status: 'pending'
        },
         [
          Permission.read(Role.user(user.id)),
          Permission.update(Role.user(user.id)),
          Permission.delete(Role.user(user.id))
        ]
      );

      setSubmitMessage('✅ Product uploaded successfully! It will be visible after admin approval.');

      setFormData({
        productName: '',
        category: '',
        condition: '',
        contactNumber: '',
        sellerName: user.firstName && user.lastName 
          ? `${user.firstName} ${user.lastName}` 
          : user.username || user.emailAddresses[0]?.emailAddress || '',
        address: '',
        price: '',
        negotiable: false,
        images: []
      });
      setPreviewUrls([]);

    } catch (error) {
      console.error('Error uploading product:', error);
      setSubmitMessage('❌ Error uploading product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-700 text-lg">Please login to upload a product.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-indigo-700">Upload Product</h2>
        <p className="text-center text-sm text-gray-500 mb-4">Hello, {user.firstName || user.username || user.emailAddresses[0]?.emailAddress}</p>
        
        <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6 flex items-start">
          <Clock className="w-5 h-5 text-blue-600 mr-3 mt-1" />
          <div>
            <p className="text-blue-700 font-semibold">Approval Required</p>
            <p className="text-sm text-blue-600">Uploaded products will be reviewed before appearing publicly.</p>
          </div>
        </div>

        <div className="grid gap-5">
          <Input label="Product Name *" name="productName" icon={Tag} value={formData.productName} onChange={handleInputChange} />
          <Select label="Category *" name="category" icon={Package} options={categories} value={formData.category} onChange={handleInputChange} />
          <Select label="Condition *" name="condition" icon={CheckSquare} options={conditions} value={formData.condition} onChange={handleInputChange} />
          <Input label="Seller Name *" name="sellerName" icon={User} value={formData.sellerName} onChange={handleInputChange} />
          <Input label="Contact Number *" name="contactNumber" icon={Phone} value={formData.contactNumber} onChange={handleInputChange} />
          <Textarea label="Address *" name="address" icon={MapPin} value={formData.address} onChange={handleInputChange} />
          <Input label="Price *" name="price" icon={DollarSign} type="number" value={formData.price} onChange={handleInputChange} />
          
          <div className="flex items-center space-x-2">
            <input type="checkbox" name="negotiable" checked={formData.negotiable} onChange={handleInputChange} />
            <label className="text-sm">Is price negotiable?</label>
          </div>

          {/* Image Upload */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Image className="w-4 h-4 mr-2" /> Product Images
            </label>
            <input type="file" multiple accept="image/*" onChange={handleImageUpload} disabled={uploadingImages} />
            {uploadingImages && <p className="text-sm text-indigo-600 mt-2">Uploading images...</p>}
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img src={url} alt={`Preview ${index}`} className="rounded-lg border w-full h-24 object-cover" />
                    <button onClick={() => removeImage(index)} className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex justify-center items-center">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {submitMessage && (
            <div className={`p-3 text-center rounded font-medium ${
              submitMessage.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {submitMessage}
            </div>
          )}

          <button onClick={handleSubmit} disabled={isSubmitting || uploadingImages} className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-all font-semibold">
            {isSubmitting ? 'Uploading...' : 'Upload Product'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper components
const Input = ({ label, name, icon: Icon, ...props }) => (
  <div>
    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
      <Icon className="w-4 h-4 mr-2" /> {label}
    </label>
    <input {...props} name={name} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
  </div>
);

const Textarea = ({ label, name, icon: Icon, ...props }) => (
  <div>
    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
      <Icon className="w-4 h-4 mr-2" /> {label}
    </label>
    <textarea {...props} name={name} rows="3" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
  </div>
);

const Select = ({ label, name, icon: Icon, options, ...props }) => (
  <div>
    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
      <Icon className="w-4 h-4 mr-2" /> {label}
    </label>
    <select {...props} name={name} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
      <option value="">Select...</option>
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export default UploadProduct;
