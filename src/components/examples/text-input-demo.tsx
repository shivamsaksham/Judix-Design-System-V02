'use client';
import { useState } from 'react';
import { TextInput } from '@/components/ui/text-input';
import { Icon } from 'judix-icon';

export default function TextInputDemo() {
    const [labels1, setLabels1] = useState(['Apples', 'Bananas', 'Cherries']);
    const [labels2, setLabels2] = useState(['Tag 1', 'Tag 2']);

    const handleRemove1 = (labelToRemove: string) => {
        setLabels1(prev => prev.filter(label => label !== labelToRemove));
    };

    const handleRemove2 = (labelToRemove: string) => {
        setLabels2(prev => prev.filter(label => label !== labelToRemove));
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">TextInput Component Demo</h1>
                    <p className="text-gray-600">All variants and combinations</p>
                </div>

                {/* Row 1: Basic States */}
                <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
                    <h2 className="text-xl font-semibold mb-4">Basic States</h2>

                    <div>
                        <h3 className="text-sm font-medium mb-2 text-gray-700">Default with Helper Text</h3>
                        <TextInput
                            label="Label"
                            placeholder="Placeholder text"
                            helperText="Helper text goes here"
                        />
                    </div>

                    <div>
                        <h3 className="text-sm font-medium mb-2 text-gray-700">Default with Info Icon</h3>
                        <TextInput
                            label="Label"
                            placeholder="Placeholder text"
                            helperText="Helper text goes here"
                            trailingAccessory={<Icon name="InfoCircle" />}
                        />
                    </div>

                    <div>
                        <h3 className="text-sm font-medium mb-2 text-gray-700">With Leading Icon</h3>
                        <TextInput
                            label="Search"
                            placeholder="Search..."
                            helperText="Search for items"
                            leadingIcon={<Icon name="SearchNormal" />}
                        />
                    </div>
                </div>

                {/* Row 2: Error State */}
                <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
                    <h2 className="text-xl font-semibold mb-4">Error State</h2>

                    <div>
                        <h3 className="text-sm font-medium mb-2 text-gray-700">Error with Icon</h3>
                        <TextInput
                            label="Email"
                            placeholder="Enter email"
                            errorMessage="Invalid email address"
                            trailingAccessory={<Icon name="InfoCircle" />}
                        />
                    </div>

                    <div>
                        <h3 className="text-sm font-medium mb-2 text-gray-700">Error without Icon</h3>
                        <TextInput
                            label="Username"
                            placeholder="Enter username"
                            errorMessage="Username already taken"
                        />
                    </div>
                </div>

                {/* Row 3: With Selected Labels */}
                <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
                    <h2 className="text-xl font-semibold mb-4">With Selected Labels (Below Input)</h2>

                    <div>
                        <h3 className="text-sm font-medium mb-2 text-gray-700">Multiple Labels</h3>
                        <TextInput
                            label="Select items"
                            placeholder="Type to search..."
                            selectedLabels={labels1.map(label => ({
                                text: label,
                                onRemove: () => handleRemove1(label),
                            }))}
                            helperText="Click × to remove items"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                            Current: {labels1.length > 0 ? labels1.join(', ') : 'None'}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium mb-2 text-gray-700">Labels with Icon</h3>
                        <TextInput
                            label="Tags"
                            placeholder="Add tags..."
                            selectedLabels={labels2.map(label => ({
                                text: label,
                                onRemove: () => handleRemove2(label),
                            }))}
                            trailingAccessory={<Icon name="Add" />}
                        />
                    </div>
                </div>

                {/* Row 3.5: Inline Labels */}
                <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
                    <h2 className="text-xl font-semibold mb-4">Inline Labels (Inside Input)</h2>

                    <div>
                        <h3 className="text-sm font-medium mb-2 text-gray-700">Labels Inside Input Field</h3>
                        <TextInput
                            label="Search with tags"
                            placeholder="Placeholder text"
                            selectedLabels={labels2.map(label => ({
                                text: label,
                                onRemove: () => handleRemove2(label),
                            }))}
                            showLabelsInline={true}
                            helperText="Labels appear inside the input before placeholder"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                            Current: {labels2.length > 0 ? labels2.join(', ') : 'None'}
                        </p>
                    </div>
                </div>

                {/* Row 4: Disabled State */}
                <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
                    <h2 className="text-xl font-semibold mb-4">Disabled State</h2>

                    <div>
                        <h3 className="text-sm font-medium mb-2 text-gray-700">Disabled with Icon</h3>
                        <TextInput
                            label="Label"
                            placeholder="Placeholder text"
                            helperText="Helper text goes here"
                            trailingAccessory={<Icon name="InfoCircle" />}
                            disabled
                        />
                    </div>

                    <div>
                        <h3 className="text-sm font-medium mb-2 text-gray-700">Disabled with Value</h3>
                        <TextInput
                            label="Read Only"
                            placeholder="Placeholder text"
                            value="This field is disabled"
                            helperText="Cannot be edited"
                            disabled
                        />
                    </div>
                </div>

                {/* Row 5: Combined Examples */}
                <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
                    <h2 className="text-xl font-semibold mb-4">Combined Examples</h2>

                    <div>
                        <h3 className="text-sm font-medium mb-2 text-gray-700">Search with Leading Icon</h3>
                        <TextInput
                            label="Search Products"
                            placeholder="Search..."
                            leadingIcon={<Icon name="SearchNormal" />}
                            trailingAccessory={<Icon name="Filter" />}
                            helperText="Use filters to narrow results"
                        />
                    </div>

                    <div>
                        <h3 className="text-sm font-medium mb-2 text-gray-700">Password Input</h3>
                        <TextInput
                            label="Password"
                            type="password"
                            placeholder="Enter password"
                            trailingAccessory={<Icon name="Eye" />}
                            helperText="Must be at least 8 characters"
                        />
                    </div>

                    <div>
                        <h3 className="text-sm font-medium mb-2 text-gray-700">Email with Validation</h3>
                        <TextInput
                            label="Email Address"
                            type="email"
                            placeholder="you@example.com"
                            leadingIcon={<Icon name="Message" />}
                            helperText="We'll never share your email"
                        />
                    </div>
                </div>

                {/* Summary */}
                <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="font-semibold mb-3">TextInput Features:</h3>
                    <ul className="space-y-2 text-sm">
                        <li>✅ <strong>States:</strong> Default, Focus, Error, Disabled</li>
                        <li>✅ <strong>Icons:</strong> Leading icon, Trailing accessory</li>
                        <li>✅ <strong>Labels:</strong> Selected labels below input OR inline (inside input)</li>
                        <li>✅ <strong>Helper Text:</strong> Contextual help and error messages</li>
                        <li>✅ <strong>Types:</strong> text, email, password, etc.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
