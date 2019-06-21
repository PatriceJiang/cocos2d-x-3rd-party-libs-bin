cmake_minimum_required(VERSION 3.6)

#set(CMAKE_C_COMPILER clang)
set(lib_name mpg123)
set(target_name ext_${lib_name})

project(${target_name} C ASM)

include(../../cmake/CocosExternalConfig.cmake)

##replace-source-list-begin
set(MPG123_SOURCE_FILES 
    compat.c
    compat_str.c
    dct64.c
    equalizer.c
    format.c
    frame.c
    icy.c
    icy2utf8.c
    id3.c
    index.c
    layer1.c
    layer2.c
    layer3.c
    libmpg123.c
    ntom.c
    optimize.c
    parse.c
    readers.c
    stringbuf.c
    synth.c
    synth_8bit.c
    synth_arm.S
    synth_s32.c
    tabinit.c
)
##replace-source-list-end

set_source_files_properties(synth_arm.S PROPERTIES COMPILE_FLAGS "-x assembler-with-cpp")



add_library(${target_name} STATIC ${MPG123_SOURCE_FILES})

target_compile_definitions(${target_name} PRIVATE OPT_ARM SAFE_NTOM)
target_compile_options(${target_name} PRIVATE "-Wno-everything")
target_include_directories(${target_name} PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/include/mpg123)

set_target_properties(${target_name} PROPERTIES
  INTERFACE_INCLUDE_DIRECTORIES ${CMAKE_CURRENT_SOURCE_DIR}/include
)

set_target_properties(${target_name}
    PROPERTIES
    ARCHIVE_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/lib"
    LIBRARY_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/lib"
    FOLDER "External"
    LINKER_LANGUAGE C
)