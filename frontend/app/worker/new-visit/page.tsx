'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function NewVisitPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    village: '',
    district: '',
    knownConditions: [] as string[],
    visitType: 'new' as 'new' | 'followup',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Patient name is required';
    if (!formData.age || parseInt(formData.age) < 0 || parseInt(formData.age) > 120) {
      newErrors.age = 'Valid age is required';
    }
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.village.trim()) newErrors.village = 'Village is required';
    if (!formData.district.trim()) newErrors.district = 'District is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // TODO: Create patient in Firestore
      // For now, store in sessionStorage and navigate
      sessionStorage.setItem('currentPatient', JSON.stringify(formData));
      
      // Navigate to vitals entry
      router.push('/worker/vitals');
    } catch (error) {
      console.error('Error creating patient:', error);
      alert('Failed to create patient. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-3xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">New Visit</h1>
            <p className="text-sm text-gray-600">{user?.name || 'Field Worker'}</p>
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => router.push('/worker/dashboard')}
          >
            Cancel
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Visit Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visit Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="visitType"
                      value="new"
                      checked={formData.visitType === 'new'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span>New Visit</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="visitType"
                      value="followup"
                      checked={formData.visitType === 'followup'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span>Follow-up</span>
                  </label>
                </div>
              </div>

              {/* Patient Name */}
              <Input
                label="Patient Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="Enter patient name"
                required
              />

              {/* Age and Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  error={errors.age}
                  placeholder="Enter age"
                  min="0"
                  max="120"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                  )}
                </div>
              </div>

              {/* Phone Number */}
              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                placeholder="+91 XXXXXXXXXX"
                required
              />

              {/* Village and District */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Village"
                  name="village"
                  value={formData.village}
                  onChange={handleChange}
                  error={errors.village}
                  placeholder="Enter village name"
                  required
                />

                <Input
                  label="District"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  error={errors.district}
                  placeholder="Enter district"
                  required
                />
              </div>

              {/* Known Conditions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Known Conditions (Optional)
                </label>
                <div className="space-y-2">
                  {['Diabetes', 'Hypertension', 'Asthma', 'Heart Disease'].map((condition) => (
                    <label key={condition} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.knownConditions.includes(condition)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              knownConditions: [...prev.knownConditions, condition]
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              knownConditions: prev.knownConditions.filter(c => c !== condition)
                            }));
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{condition}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push('/worker/dashboard')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Continue to Vitals'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
