# AGENTS.md

This is a repository for custom made Bitwig Controller Scripts for hardware controllers made by various companies like Novation, Korg or Behringer.
All Controller Scripts are written using Javascript.
There is no runtime - this folder is scanned by Bitwig and I test script functionality directly in Bitwig.

## Bitwig API

Bitwig provides a powerful API to interact with from the scripts. 
You can find the full documentation in `./bitwig6/bitwig-6-api-documentation`.
When you are developing scripts, always consult the documentation.

## Bitwig versions

Bitwig is currently transitioning to version 6 which is currently in Beta. 
The corresponding API version is 25.  
All new scripts are targeting this version. You can largely ignore the `bitwig5` folder - it will be removed upon the stable release.

## Bitwig documentation

Bitwig 6 (the DAW itself) doesn't have the full documentation yet. 
Until it is released we'll use the Bitwig 5 documentation at `./docs/bitwig-5-documentation`.
You can refer to this file when I ask something specific about the DAW itself and not the API.

## Coding style 

- Prefer clean, concise and simple code.

## Script files

A script consist of two files: a `.control.js` file which contains the code, and a `package.json` file.

## Folder structure

The scripts files are to be placed in the `./bitwig6/` folder with the following sub-folder structure: 

```
./bitwig6/<manufacturer>/<controller-code>/script-name/
```

For example, the `lcxl-ar` script files for the Launch Control XL 3 from Novation are placed under:

```
./bitwig6/novation/lcxl3/lcxl-ar/
```

