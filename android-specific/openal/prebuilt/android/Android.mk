LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)

LOCAL_MODULE := ext_openal
LOCAL_MODULE_FILENAME := openal
LOCAL_SRC_FILES := $(TARGET_ARCH_ABI)/openal.a
LOCAL_EXPORT_C_INCLUDES := $(LOCAL_PATH)/../../include
include $(PREBUILT_STATIC_LIBRARY)
