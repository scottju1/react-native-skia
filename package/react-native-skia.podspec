# @shopify/react-native-skia.podspec

require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-skia"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  @shopify/react-native-skia
                   DESC
  s.homepage     = "https://github.com/github_account/@shopify/react-native-skia"
  # brief license entry:
  s.license      = "MIT"
  # optional - use expanded license entry instead:
  # s.license    = { :type => "MIT", :file => "LICENSE" }
  s.authors      = { "Your Name" => "yourname@email.com" }
  s.platforms    = { :ios => "9.0" }
  s.source       = { :git => "https://github.com/github_account/@shopify/react-native-skia.git", :tag => "#{s.version}" }

  s.requires_arc = true
  s.xcconfig = {
    'GCC_PREPROCESSOR_DEFINITIONS' => '$(inherited) SK_GL=1 SK_METAL=1'    
  }
  s.frameworks = 'GLKit', 'MetalKit'

  s.ios.vendored_libraries = [
    'libs/ios/libskia.a', 
    'libs/ios/libsvg.a', 
    'libs/ios/libskshaper.a'
  ]

  # All iOS cpp/h files
  s.source_files = [
    "ios/**/*.{h,c,cc,cpp,m,mm,swift}",  
  ]

  s.subspec 'Skia-Includes' do |ss|
    ss.header_mappings_dir = 'cpp/skia/include'
    ss.source_files = "../externals/skia/include/**/*.{h,cpp}"
  end

  s.subspec 'Utils' do |ss|
    ss.header_mappings_dir = 'cpp/utils'
    ss.source_files = "cpp/utils/**/*.{h,cpp}"
  end

  s.subspec 'Jsi' do |ss|
    ss.header_mappings_dir = 'cpp/jsi'
    ss.source_files = "cpp/jsi/**/*.{h,cpp}"
  end

  s.subspec 'RNSkia' do |ss|
    ss.header_mappings_dir = 'cpp/rnskia'
    ss.source_files = "cpp/rnskia/**/*.{h,cpp}"
  end

  s.dependency "React"
  s.dependency "React-callinvoker"
  s.dependency "React-Core"
end
