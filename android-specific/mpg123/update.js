//@ts-check
const fs = require("fs");
const path = require("path");
const child_process = require("child_process");
const crypto = require("crypto");

const mpg123_src_dir = "/home/jiang/Downloads/mpg123-1.25.10";


const append_file = [
    "abi_align.h",
    "compat.c",
    "compat_str.c",
    "debug.h",
    "fmt123.h",
    "gapless.h",
    "getcpuflags.h",
    "icy.h",
    "icy2utf8.h",
    "intsym.h",
    "mpeghead.h",
    "newhuffman.h",
    "stringbuf.c",
    "synth_8bit.h",
    "synth_8bit.c",
    "synth_s32.c"
];

const prefer = [
    "/home/jiang/Downloads/mpg123-1.25.10/src/config.h",
    "/home/jiang/Downloads/mpg123-1.25.10/src/libmpg123/equalizer.c",
    "/home/jiang/Downloads/mpg123-1.25.10/src/libmpg123/mpg123.h"
];

const replace_patterns = [
    { pattern: "<fmt123.h>", to: `"fmt123.h"` }
]


function find_all_files() {
    let files = fs.readdirSync(__dirname);

    let list = files.filter(x => {
        if (x.endsWith(".c") || x.endsWith(".h") || x.endsWith(".S")) {
            return true;
        }
        return false;
    }).map(x => {
        return {
            name: x,
            required: true
        };
    });

    //append files
    for (let f of append_file) {
        if (files.indexOf(f) < 0) {
            files.push(f);

            list.push({
                name: f,
                required: true
            });
        }
        let f_doc = f.replace(/\.h$/, ".c");
        if (f.endsWith(".h") && files.indexOf(f_doc) < 0) {
            let m = {
                name: f_doc,
                required: false
            };
            console.log(`~~I guess you may want ${m.name}`);
            list.push(m);
        }
    }
    return list;
}

function find_file_in_dir(f, dir, required) {
    let fn = path.basename(f);
    let cmd = `find ${dir} -name "${fn}"`;
    let result = child_process.execSync(cmd).toString().trim();
    if (result.length == 0) {
        if (required) {
            console.error(`failed to find file ${fn} in ${dir}`);
            process.abort();
        } else {
            return null;
        }
    }
    let rows = result.split("\n");
    if (rows.length > 1) {
        console.error(`find multiply ${fn} in ${dir}`);

        for (let f of rows) {
            console.log(`  ${f}`);
        }

        for (let r of rows) {
            for (let p of prefer) {
                if (p == r) {
                    return r;
                }
            }
        }


        process.abort();
    }
    return result;
}


function getMd5(content) {
    let hash = crypto.createHash("sha256");
    hash.update(content);
    return hash.digest().toString("hex");
}

function copy_with_replace(src, dst) {
    let content = fs.readFileSync(src).toString();
    let logs = [];
    for (let rep of replace_patterns) {
        if (content.indexOf(rep.pattern) > 0) {
            content = content.replace(rep.pattern, rep.to);
            logs.push(` replace ${rep.pattern} with ${rep.to}`);
        }
    }
    if (!fs.existsSync(dst) || getMd5(content) != getMd5(fs.readFileSync(dst))) {
        fs.writeFileSync(dst, content);
        console.log(logs.join("\n"));
    } else {
        console.log(" ...");
    }
}


function copy_files_here() {
    let files = find_all_files();
    for (let item of files) {
        let x = find_file_in_dir(item.name, mpg123_src_dir, item.required);
        if (x != null) {
            console.log(`cp ${x} ${item.name}`);
            copy_with_replace(x, item.name);
        } else {
            console.log(`optional file ${item.name} not found!`);
        }
    }
}

copy_files_here();

function update_cmake() {
    let sources = fs.readdirSync(__dirname).filter(x => x.endsWith(".c") || x.endsWith(".S"));
    sources.sort();
    const mark_start = "##replace-source-list-begin";
    const mark_end = "##replace-source-list-end";
    let new_content = [
        mark_start,
        "set(MPG123_SOURCE_FILES ", sources.map(x=> "    "+x).join("\n"), ")"
        ,mark_end
    ];

    let cmakeListsContent = fs.readFileSync("CMakeLists.txt").toString();
    let start = cmakeListsContent.indexOf(mark_start);
    let end = cmakeListsContent.indexOf(mark_end);
    if(start < 0 || end < 0) {
        console.error(`failed to locate ${mark_start} / ${mark_end}`);
        process.abort();
    }

    let ret = cmakeListsContent.substr(0, start) + new_content.join("\n") + cmakeListsContent.substring(mark_end.length + end);
    if(getMd5(ret)!=getMd5(cmakeListsContent)) {
        fs.writeFileSync("CMakeLists.txt", ret);
        console.log("update CMakeLists.txt!");
    } else {
        console.log("CMakeLists.txt is not changed!");
    }
}

update_cmake();