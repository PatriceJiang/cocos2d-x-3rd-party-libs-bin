
cmake_minimum_required(VERSION 3.6)

set(lib_name vorbis)
set(target_name ext_${lib_name})

project(${lib_name} C)

include(../../cmake/CocosExternalConfig.cmake)

set(OGG_SOURCE
    libogg/bitwise.c 
    libogg/framing.c
)

set(VORBIS_STREAM_SOURCE
    libvorbis-stream/jni-util.c
    libvorbis-stream/vorbis-fileinputstream.c
    libvorbis-stream/vorbis-fileoutputstream.c
)
set(VORBIS_SOURCE
    libvorbis/mdct.c
    libvorbis/smallft.c
    libvorbis/block.c
    libvorbis/envelope.c
    libvorbis/window.c
    libvorbis/lsp.c
    libvorbis/lpc.c
    libvorbis/analysis.c
    libvorbis/synthesis.c
    libvorbis/psy.c
    libvorbis/info.c
    libvorbis/floor1.c
    libvorbis/floor0.c
    libvorbis/res0.c
    libvorbis/mapping0.c
    libvorbis/registry.c
    libvorbis/codebook.c
    libvorbis/sharedbook.c
    libvorbis/lookup.c
    libvorbis/bitrate.c
    libvorbis/vorbisfile.c
    libvorbis/vorbisenc.c
)

add_library(ext_ogg STATIC ${OGG_SOURCE})
add_library(ext_vorbis STATIC ${VORBIS_SOURCE})
add_library(ext_vorbis_stream STATIC ${VORBIS_STREAM_SOURCE})

target_include_directories(ext_ogg PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/include)
target_include_directories(ext_vorbis PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/include)
target_include_directories(ext_vorbis PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/libvorbis)
target_include_directories(ext_vorbis_stream PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/include)


target_link_libraries(ext_vorbis ext_ogg ext_vorbis_stream )

set_target_properties(ext_ogg
    PROPERTIES
    ARCHIVE_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/lib"
    LIBRARY_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/lib"
    FOLDER "External"
    LINKER_LANGUAGE C
)
set_target_properties(ext_vorbis
    PROPERTIES
    ARCHIVE_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/lib"
    LIBRARY_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/lib"
    FOLDER "External"
    LINKER_LANGUAGE C
)
set_target_properties(ext_vorbis_stream
    PROPERTIES
    ARCHIVE_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/lib"
    LIBRARY_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/lib"
    FOLDER "External"
    LINKER_LANGUAGE C
)

