const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: 'dei70b5tm', 
    api_key: '556369944592997', 
    api_secret: 'ZSJmUvkiJUAiQvDw_uOKae-IEvQ' 
});

(async function() {
    console.log('📤 Uploading image...');
    
    const uploadResult = await cloudinary.uploader.upload(
        'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', 
        { public_id: 'shoes_test' }
    ).catch((error) => {
        console.log('❌ Upload error:', error);
    });
    
    if (!uploadResult) return;
    
    console.log('✅ Upload successful!');
    console.log('📷 Public ID:', uploadResult.public_id);
    console.log('🔗 Secure URL:', uploadResult.secure_url);
    
    console.log('\n📊 Image details:');
    console.log('   Width:', uploadResult.width);
    console.log('   Height:', uploadResult.height);
    console.log('   Format:', uploadResult.format);
    console.log('   Size:', uploadResult.bytes, 'bytes');
    
    const optimizedUrl = cloudinary.url('shoes_test', {
        fetch_format: 'auto',
        quality: 'auto'
    });
    
    console.log('\n✨ Transformation done!');
    console.log('🔗 Optimized image URL:');
    console.log(optimizedUrl);
    console.log('\n📌 Open the link above to see the optimized image!');
})();