#!/bin/bash
# Script to check build configuration before CI/CD

echo "=== Checking Build Configuration ==="

# Check critical files
echo "1. Checking critical files..."
[ -f "package.json" ] && echo "✓ package.json exists" || echo "✗ package.json missing"
[ -f "android/build.gradle" ] && echo "✓ android/build.gradle exists" || echo "✗ android/build.gradle missing"
[ -f "android/app/build.gradle" ] && echo "✓ android/app/build.gradle exists" || echo "✗ android/app/build.gradle missing"
[ -f "android/settings.gradle" ] && echo "✓ android/settings.gradle exists" || echo "✗ android/settings.gradle missing"
[ -f "android/gradle.properties" ] && echo "✓ android/gradle.properties exists" || echo "✗ android/gradle.properties missing"
[ -f "android/gradle/wrapper/gradle-wrapper.properties" ] && echo "✓ gradle-wrapper.properties exists" || echo "✗ gradle-wrapper.properties missing"
[ -f "android/gradlew" ] && echo "✓ gradlew exists" || echo "✗ gradlew missing"
[ -f "index.js" ] && echo "✓ index.js exists" || echo "✗ index.js missing"
[ -f "App.tsx" ] || [ -f "App.js" ] && echo "✓ App.tsx/App.js exists" || echo "✗ App.tsx/App.js missing"

# Check AndroidManifest
echo ""
echo "2. Checking AndroidManifest..."
[ -f "android/app/src/main/AndroidManifest.xml" ] && echo "✓ AndroidManifest.xml exists" || echo "✗ AndroidManifest.xml missing"

# Check Java files
echo ""
echo "3. Checking Java source files..."
[ -f "android/app/src/main/java/ru/plazma/lk/MainActivity.java" ] && echo "✓ MainActivity.java exists" || echo "✗ MainActivity.java missing"
[ -f "android/app/src/main/java/ru/plazma/lk/MainApplication.java" ] && echo "✓ MainApplication.java exists" || echo "✗ MainApplication.java missing"

# Check gradle.properties settings
echo ""
echo "4. Checking gradle.properties..."
if [ -f "android/gradle.properties" ]; then
    grep -q "hermesEnabled=true" android/gradle.properties && echo "✓ hermesEnabled is set" || echo "⚠ hermesEnabled not found"
    grep -q "android.useAndroidX=true" android/gradle.properties && echo "✓ AndroidX enabled" || echo "⚠ AndroidX not enabled"
fi

# Check build.gradle for common issues
echo ""
echo "5. Checking build.gradle configuration..."
if [ -f "android/app/build.gradle" ]; then
    grep -q "namespace" android/app/build.gradle && echo "✓ namespace is set" || echo "⚠ namespace not found"
    grep -q "applicationId" android/app/build.gradle && echo "✓ applicationId is set" || echo "⚠ applicationId not found"
    grep -q "hermesEnabled\|enableHermes" android/app/build.gradle && echo "✓ Hermes configuration found" || echo "⚠ Hermes configuration not found"
fi

# Check package.json
echo ""
echo "6. Checking package.json..."
if [ -f "package.json" ]; then
    grep -q "\"react-native\"" package.json && echo "✓ react-native dependency found" || echo "⚠ react-native dependency not found"
    grep -q "\"react\"" package.json && echo "✓ react dependency found" || echo "⚠ react dependency not found"
fi

echo ""
echo "=== Configuration Check Complete ==="

