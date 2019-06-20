cmake_minimum_required(VERSION 3.6)

#set(CMAKE_C_COMPILER clang)
set(lib_name mpg123)
set(target_name ext_${lib_name})

project(${target_name} C ASM)

include(../../cmake/CocosExternalConfig.cmake)

set(MPG123_SOURCE_FILES 
    equalizer.c
    index.c
    layer2.c
    synth.c
    dct64.c
    format.c
    layer3.c
    ntom.c
    parse.c
    readers.c
    frame.c
    layer1.c
    libmpg123.c
    optimize.c
    synth_arm.S
    tabinit.c
    id3.c)

set_source_files_properties(synth_arm.S PROPERTIES COMPILE_FLAGS "-x assembler-with-cpp")



add_library(${target_name} STATIC ${MPG123_SOURCE_FILES})

#target_compile_definitions(${target_name} PRIVATE "real=long")
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