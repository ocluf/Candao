if [ ! -f /usr/local/bin/ic-repl ]; then
  read -p "ic-repl not installed. Install? [y/N]" -n 1 -r
  echo 
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    cd /tmp

    unameOut="$(uname -s)"
    case "${unameOut}" in
        Linux*)     IC_REPL_NAME=ic-repl-linux64;;
        Darwin*)    IC_REPL_NAME=ic-repl-macos;;
    esac

    wget https://github.com/chenyan2002/ic-repl/releases/download/2021-09-18/${IC_REPL_NAME} -O ${IC_REPL_NAME}
    cp ./${IC_REPL_NAME} /usr/local/bin/ic-repl
    chmod a+x /usr/local/bin/ic-repl
    cd -
  fi
fi

find . -name \*.test.repl -exec ic-repl {} \;
