# `builder`

The builder is to be used as a command line tool which analyses an NPM packages and searches online for source in aGit repository, which it then downloads. In some cases the source code must be built to replicate the publication process as it was done originally when the NPM package was published to the NPM registry. The source code is compared with the content of an NPM package in the NPM registry. When differences in these packages are found the user is made aware of this. This way the impact of an es-lint like incident can be avoided.
