(Files content cropped to 300k characters, download full ingest to see more)
================================================
FILE: README.md
================================================
# DrivenByMoss
Bitwig Studio extensions to support several controllers

### Building and Installing the extension

Users should download and install the version from the
[main site](http://www.mossgrabers.de/Software/Bitwig/Bitwig.html).
These directions are for developers to test changes prior to release.

1. Install Maven and dependences, either [from here](https://maven.apache.org/install.html)
or if on Linux, using the distro package manager, e.g. `yum install maven` or
`apt-get install maven`.
2. Run `mvn install` in this repo's root.
3. Follow [installation instructions] in the included manual for further steps.



================================================
FILE: checkdependencies.cmd
================================================
set JAVA_HOME=%JAVA_HOME21%
mvn versions:display-plugin-updates versions:display-dependency-updates


================================================
FILE: debug-linux.sh
================================================
export BITWIG_DEBUG_PORT=5005
/opt/bitwig-studio/bitwig-studio



================================================
FILE: dependency-reduced-pom.xml
================================================
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>de.mossgrabers</groupId>
  <artifactId>DrivenByMoss</artifactId>
  <name>DrivenByMoss</name>
  <version>26.2.0</version>
  <licenses>
    <license>
      <name>LGPL-2.1-or-later</name>
      <url>https://www.gnu.org/licenses/old-licenses/lgpl-2.1</url>
      <distribution>repo</distribution>
    </license>
  </licenses>
  <build>
    <plugins>
      <plugin>
        <artifactId>maven-enforcer-plugin</artifactId>
        <version>3.6.1</version>
        <executions>
          <execution>
            <id>enforce-maven</id>
            <goals>
              <goal>enforce</goal>
            </goals>
            <configuration>
              <rules>
                <requireMavenVersion>
                  <version>3.8.1</version>
                </requireMavenVersion>
              </rules>
            </configuration>
          </execution>
        </executions>
      </plugin>
      <plugin>
        <artifactId>maven-compiler-plugin</artifactId>
        <version>3.14.0</version>
        <executions>
          <execution>
            <id>default-testCompile</id>
            <phase>test-compile</phase>
            <goals>
              <goal>testCompile</goal>
            </goals>
            <configuration>
              <skip>true</skip>
            </configuration>
          </execution>
        </executions>
        <configuration>
          <fork>true</fork>
          <source>21</source>
          <target>21</target>
          <encoding>UTF-8</encoding>
        </configuration>
      </plugin>
      <plugin>
        <artifactId>maven-jar-plugin</artifactId>
        <version>3.4.2</version>
        <configuration>
          <archive>
            <manifest>
              <addDefaultImplementationEntries>true</addDefaultImplementationEntries>
            </manifest>
          </archive>
        </configuration>
      </plugin>
      <plugin>
        <artifactId>maven-shade-plugin</artifactId>
        <version>3.6.0</version>
        <executions>
          <execution>
            <phase>package</phase>
            <goals>
              <goal>shade</goal>
            </goals>
            <configuration>
              <artifactSet>
                <excludes>
                  <exclude>com.bitwig:extension-api</exclude>
                </excludes>
              </artifactSet>
              <filters>
                <filter>
                  <artifact>net.java.dev.jna:*</artifact>
                  <excludes>
                    <exclude>META-INF/*</exclude>
                  </excludes>
                </filter>
                <filter>
                  <artifact>purejavahidapi:*</artifact>
                  <excludes>
                    <exclude>META-INF/*</exclude>
                  </excludes>
                </filter>
                <filter>
                  <artifact>com.badlogicgames.*:*</artifact>
                  <excludes>
                    <exclude>META-INF/*</exclude>
                  </excludes>
                </filter>
                <filter>
                  <artifact>de.mossgrabers:nativefilechooser</artifact>
                  <excludes>
                    <exclude>META-INF/*</exclude>
                  </excludes>
                </filter>
                <filter>
                  <artifact>com.fasterxml.jackson.core:*</artifact>
                  <excludes>
                    <exclude>META-INF/**</exclude>
                  </excludes>
                </filter>
              </filters>
            </configuration>
          </execution>
        </executions>
      </plugin>
      <plugin>
        <groupId>com.coderplus.maven.plugins</groupId>
        <artifactId>copy-rename-maven-plugin</artifactId>
        <version>1.0.1</version>
        <executions>
          <execution>
            <id>rename-file</id>
            <phase>install</phase>
            <goals>
              <goal>copy</goal>
            </goals>
            <configuration>
              <sourceFile>${project.build.directory}/${project.build.finalName}.jar</sourceFile>
              <destinationFile>${bitwig.extension.directory}/DrivenByMoss.bwextension</destinationFile>
            </configuration>
          </execution>
        </executions>
      </plugin>
      <plugin>
        <artifactId>maven-assembly-plugin</artifactId>
        <version>3.7.1</version>
        <executions>
          <execution>
            <id>create-archive</id>
            <phase>package</phase>
            <goals>
              <goal>single</goal>
            </goals>
          </execution>
        </executions>
        <configuration>
          <descriptors>
            <descriptor>src/assembly/dep.xml</descriptor>
          </descriptors>
        </configuration>
      </plugin>
      <plugin>
        <groupId>org.codehaus.mojo</groupId>
        <artifactId>versions-maven-plugin</artifactId>
        <version>2.19.0</version>
        <configuration>
          <ignoredVersions>.*-M.*,.*-alpha.*,.*-beta.*,.*-ea.*,.*-rc.*</ignoredVersions>
          <generateBackupPoms>false</generateBackupPoms>
        </configuration>
      </plugin>
      <plugin>
        <groupId>org.codehaus.mojo</groupId>
        <artifactId>license-maven-plugin</artifactId>
        <version>2.6.0</version>
        <executions>
          <execution>
            <id>add-third-party</id>
            <goals>
              <goal>add-third-party</goal>
            </goals>
          </execution>
        </executions>
        <configuration>
          <sortArtifactByName>true</sortArtifactByName>
          <licenseMerges>
            <licenseMerge>The Apache Software License, Version 2.0|Apache License, Version 2.0|Apache Public License 2.0|Apache-2.0</licenseMerge>
          </licenseMerges>
          <excludedGroups>com\.bitwig.*|de\.mossgrabers.*</excludedGroups>
        </configuration>
      </plugin>
      <plugin>
        <artifactId>maven-clean-plugin</artifactId>
        <version>3.5.0</version>
      </plugin>
      <plugin>
        <artifactId>maven-resources-plugin</artifactId>
        <version>3.3.1</version>
      </plugin>
      <plugin>
        <artifactId>maven-deploy-plugin</artifactId>
        <version>3.1.4</version>
      </plugin>
      <plugin>
        <artifactId>maven-install-plugin</artifactId>
        <version>3.1.4</version>
      </plugin>
      <plugin>
        <artifactId>maven-site-plugin</artifactId>
        <version>4.0.0-M6</version>
      </plugin>
      <plugin>
        <artifactId>maven-surefire-plugin</artifactId>
        <version>3.5.3</version>
      </plugin>
    </plugins>
  </build>
  <repositories>
    <repository>
      <id>maven-local-repository</id>
      <url>file:///${project.basedir}/maven-local-repository</url>
    </repository>
    <repository>
      <id>MavenCentral</id>
      <name>Maven Central Repository</name>
      <url>https://mvnrepository.com</url>
    </repository>
    <repository>
      <id>bitwig</id>
      <name>Bitwig Maven Repository</name>
      <url>https://maven.bitwig.com</url>
    </repository>
  </repositories>
  <dependencies>
    <dependency>
      <groupId>com.bitwig</groupId>
      <artifactId>extension-api</artifactId>
      <version>21</version>
      <scope>compile</scope>
    </dependency>
  </dependencies>
  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
  </properties>
</project>



================================================
FILE: InstallHIDLibrary.cmd
================================================
set JAVA_HOME=%JAVA_HOME21%
set SOURCE=C:/Privat/Programming/Libraries/USB/purejavahidapi/target
set DESTINATION=./maven-local-repository

mvn deploy:deploy-file -Dfile=%SOURCE%/purejavahidapi-0.0.18.jar -Dsources=%SOURCE%/purejavahidapi-0.0.18-sources.jar -Djavadoc=%SOURCE%/purejavahidapi-0.0.18-javadoc.jar -DgroupId=purejavahidapi -DartifactId=purejavahidapi -Dversion=0.0.18 -Dpackaging=jar -Durl=file:%DESTINATION% -DrepositoryId=maven-repository -DupdateReleaseInfo=true


================================================
FILE: LICENSE
================================================
                   GNU LESSER GENERAL PUBLIC LICENSE
                       Version 3, 29 June 2007

 Copyright (C) 2007 Free Software Foundation, Inc. <http://fsf.org/>
 Everyone is permitted to copy and distribute verbatim copies
 of this license document, but changing it is not allowed.


  This version of the GNU Lesser General Public License incorporates
the terms and conditions of version 3 of the GNU General Public
License, supplemented by the additional permissions listed below.

  0. Additional Definitions.

  As used herein, "this License" refers to version 3 of the GNU Lesser
General Public License, and the "GNU GPL" refers to version 3 of the GNU
General Public License.

  "The Library" refers to a covered work governed by this License,
other than an Application or a Combined Work as defined below.

  An "Application" is any work that makes use of an interface provided
by the Library, but which is not otherwise based on the Library.
Defining a subclass of a class defined by the Library is deemed a mode
of using an interface provided by the Library.

  A "Combined Work" is a work produced by combining or linking an
Application with the Library.  The particular version of the Library
with which the Combined Work was made is also called the "Linked
Version".

  The "Minimal Corresponding Source" for a Combined Work means the
Corresponding Source for the Combined Work, excluding any source code
for portions of the Combined Work that, considered in isolation, are
based on the Application, and not on the Linked Version.

  The "Corresponding Application Code" for a Combined Work means the
object code and/or source code for the Application, including any data
and utility programs needed for reproducing the Combined Work from the
Application, but excluding the System Libraries of the Combined Work.

  1. Exception to Section 3 of the GNU GPL.

  You may convey a covered work under sections 3 and 4 of this License
without being bound by section 3 of the GNU GPL.

  2. Conveying Modified Versions.

  If you modify a copy of the Library, and, in your modifications, a
facility refers to a function or data to be supplied by an Application
that uses the facility (other than as an argument passed when the
facility is invoked), then you may convey a copy of the modified
version:

   a) under this License, provided that you make a good faith effort to
   ensure that, in the event an Application does not supply the
   function or data, the facility still operates, and performs
   whatever part of its purpose remains meaningful, or

   b) under the GNU GPL, with none of the additional permissions of
   this License applicable to that copy.

  3. Object Code Incorporating Material from Library Header Files.

  The object code form of an Application may incorporate material from
a header file that is part of the Library.  You may convey such object
code under terms of your choice, provided that, if the incorporated
material is not limited to numerical parameters, data structure
layouts and accessors, or small macros, inline functions and templates
(ten or fewer lines in length), you do both of the following:

   a) Give prominent notice with each copy of the object code that the
   Library is used in it and that the Library and its use are
   covered by this License.

   b) Accompany the object code with a copy of the GNU GPL and this license
   document.

  4. Combined Works.

  You may convey a Combined Work under terms of your choice that,
taken together, effectively do not restrict modification of the
portions of the Library contained in the Combined Work and reverse
engineering for debugging such modifications, if you also do each of
the following:

   a) Give prominent notice with each copy of the Combined Work that
   the Library is used in it and that the Library and its use are
   covered by this License.

   b) Accompany the Combined Work with a copy of the GNU GPL and this license
   document.

   c) For a Combined Work that displays copyright notices during
   execution, include the copyright notice for the Library among
   these notices, as well as a reference directing the user to the
   copies of the GNU GPL and this license document.

   d) Do one of the following:

       0) Convey the Minimal Corresponding Source under the terms of this
       License, and the Corresponding Application Code in a form
       suitable for, and under terms that permit, the user to
       recombine or relink the Application with a modified version of
       the Linked Version to produce a modified Combined Work, in the
       manner specified by section 6 of the GNU GPL for conveying
       Corresponding Source.

       1) Use a suitable shared library mechanism for linking with the
       Library.  A suitable mechanism is one that (a) uses at run time
       a copy of the Library already present on the user's computer
       system, and (b) will operate properly with a modified version
       of the Library that is interface-compatible with the Linked
       Version.

   e) Provide Installation Information, but only if you would otherwise
   be required to provide such information under section 6 of the
   GNU GPL, and only to the extent that such information is
   necessary to install and execute a modified version of the
   Combined Work produced by recombining or relinking the
   Application with a modified version of the Linked Version. (If
   you use option 4d0, the Installation Information must accompany
   the Minimal Corresponding Source and Corresponding Application
   Code. If you use option 4d1, you must provide the Installation
   Information in the manner specified by section 6 of the GNU GPL
   for conveying Corresponding Source.)

  5. Combined Libraries.

  You may place library facilities that are a work based on the
Library side by side in a single library together with other library
facilities that are not Applications and are not covered by this
License, and convey such a combined library under terms of your
choice, if you do both of the following:

   a) Accompany the combined library with a copy of the same work based
   on the Library, uncombined with any other library facilities,
   conveyed under the terms of this License.

   b) Give prominent notice with the combined library that part of it
   is a work based on the Library, and explaining where to find the
   accompanying uncombined form of the same work.

  6. Revised Versions of the GNU Lesser General Public License.

  The Free Software Foundation may publish revised and/or new versions
of the GNU Lesser General Public License from time to time. Such new
versions will be similar in spirit to the present version, but may
differ in detail to address new problems or concerns.

  Each version is given a distinguishing version number. If the
Library as you received it specifies that a certain numbered version
of the GNU Lesser General Public License "or any later version"
applies to it, you have the option of following the terms and
conditions either of that published version or of any later version
published by the Free Software Foundation. If the Library as you
received it does not specify a version number of the GNU Lesser
General Public License, you may choose any version of the GNU Lesser
General Public License ever published by the Free Software Foundation.

  If the Library as you received it specifies that a proxy can decide
whether future versions of the GNU Lesser General Public License shall
apply, that proxy's public statement of acceptance of any version is
permanent authorization for you to choose that version for the
Library.



================================================
FILE: pom.xml
================================================
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<groupId>de.mossgrabers</groupId>
	<artifactId>DrivenByMoss</artifactId>
	<packaging>jar</packaging>
	<name>DrivenByMoss</name>
	<version>26.2.0</version>
	<properties>
		<project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
	</properties>

	<licenses>
		<license>
			<name>LGPL-2.1-or-later</name>
			<url>https://www.gnu.org/licenses/old-licenses/lgpl-2.1</url>
			<distribution>repo</distribution>
		</license>
	</licenses>

	<repositories>
		<repository>
			<id>maven-local-repository</id>
			<url>file:///${project.basedir}/maven-local-repository</url>
		</repository>
		<repository>
			<id>MavenCentral</id>
			<name>Maven Central Repository</name>
			<url>https://mvnrepository.com</url>
		</repository>
		<repository>
			<id>bitwig</id>
			<name>Bitwig Maven Repository</name>
			<url>https://maven.bitwig.com</url>
		</repository>
	</repositories>

	<dependencies>
		<dependency>
			<groupId>com.bitwig</groupId>
			<artifactId>extension-api</artifactId>
			<version>21</version>
		</dependency>
		<dependency>
			<groupId>net.java.dev.jna</groupId>
			<artifactId>jna</artifactId>
			<version>5.17.0</version>
		</dependency>
		<dependency>
			<groupId>net.java.dev.jna</groupId>
			<artifactId>jna-platform</artifactId>
			<version>5.17.0</version>
		</dependency>
		<dependency>
			<groupId>purejavahidapi</groupId>
			<artifactId>purejavahidapi</artifactId>
			<version>0.0.23</version>
		</dependency>
		<dependency>
			<artifactId>nativefilechooser</artifactId>
			<groupId>de.mossgrabers</groupId>
			<version>1.3.3</version>
		</dependency>
		<dependency>
			<groupId>com.fasterxml.jackson.core</groupId>
			<artifactId>jackson-databind</artifactId>
			<version>2.20.0</version>
		</dependency>
		<!-- Gamepad support. -->
		<dependency>
			<groupId>com.badlogicgames.jamepad</groupId>
			<artifactId>jamepad</artifactId>
			<version>2.30.0.0</version>
		</dependency>
	</dependencies>

	<build>

		<plugins>

			<!-- Enforce a minimum Maven version -->
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-enforcer-plugin</artifactId>
				<version>3.6.1</version>
				<executions>
					<execution>
						<id>enforce-maven</id>
						<goals>
							<goal>enforce</goal>
						</goals>
						<configuration>
							<rules>
								<requireMavenVersion>
									<version>3.8.1</version>
								</requireMavenVersion>
							</rules>
						</configuration>
					</execution>
				</executions>
			</plugin>

			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-compiler-plugin</artifactId>
				<version>3.14.0</version>
				<configuration>
					<fork>true</fork>
					<source>21</source>
					<target>21</target>
					<encoding>UTF-8</encoding>
				</configuration>
				<executions>
					<execution>
						<id>default-testCompile</id>
						<phase>test-compile</phase>
						<goals>
							<goal>testCompile</goal>
						</goals>
						<configuration>
							<skip>true</skip>
						</configuration>
					</execution>
				</executions>				
			</plugin>

			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-jar-plugin</artifactId>
				<version>3.4.2</version>
				<configuration>
					<archive>
						<manifest>
							<addDefaultImplementationEntries>true</addDefaultImplementationEntries>
						</manifest>
					</archive>
				</configuration>
			</plugin>

			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-shade-plugin</artifactId>
				<version>3.6.0</version>
				<executions>
					<execution>
						<phase>package</phase>
						<goals>
							<goal>shade</goal>
						</goals>
						<configuration>
							<artifactSet>
								<excludes>
									<exclude>com.bitwig:extension-api</exclude>
								</excludes>
							</artifactSet>
							<filters>
								<filter>
									<artifact>net.java.dev.jna:*</artifact>
									<excludes>
										<exclude>META-INF/*</exclude>
									</excludes>
								</filter>
								<filter>
									<artifact>purejavahidapi:*</artifact>
									<excludes>
										<exclude>META-INF/*</exclude>
									</excludes>
								</filter>
								<filter>
									<artifact>com.badlogicgames.*:*</artifact>
									<excludes>
										<exclude>META-INF/*</exclude>
									</excludes>
								</filter>
								<filter>
									<artifact>de.mossgrabers:nativefilechooser</artifact>
									<excludes>
										<exclude>META-INF/*</exclude>
									</excludes>
								</filter>
								<filter>
									<artifact>com.fasterxml.jackson.core:*</artifact>
									<excludes>
										<exclude>META-INF/**</exclude>
									</excludes>
								</filter>
							</filters>
						</configuration>
					</execution>
				</executions>
			</plugin>

			<plugin>
				<groupId>com.coderplus.maven.plugins</groupId>
				<artifactId>copy-rename-maven-plugin</artifactId>
				<version>1.0.1</version>
				<executions>
					<execution>
						<id>rename-file</id>
						<phase>install</phase>
						<goals>
							<goal>copy</goal>
						</goals>
						<configuration>
							<sourceFile>${project.build.directory}/${project.build.finalName}.jar</sourceFile>
							<destinationFile>${bitwig.extension.directory}/DrivenByMoss.bwextension</destinationFile>
						</configuration>
					</execution>
				</executions>
			</plugin>

			<plugin>
				<artifactId>maven-assembly-plugin</artifactId>
				<version>3.7.1</version>
				<configuration>
					<descriptors>
						<descriptor>src/assembly/dep.xml</descriptor>
					</descriptors>
				</configuration>
				<executions>
					<execution>
						<id>create-archive</id>
						<phase>package</phase>
						<goals>
							<goal>single</goal>
						</goals>
					</execution>
				</executions>
			</plugin>

			<!-- Check for outdated libraries -->
			<plugin>
				<groupId>org.codehaus.mojo</groupId>
				<artifactId>versions-maven-plugin</artifactId>
				<version>2.19.0</version>
				<configuration>
					<ignoredVersions>.*-M.*,.*-alpha.*,.*-beta.*,.*-ea.*,.*-rc.*</ignoredVersions>
					<generateBackupPoms>false</generateBackupPoms>
				</configuration>
			</plugin>

			<!-- Retrieve and collect library licenses -->
			<plugin>
				<groupId>org.codehaus.mojo</groupId>
				<artifactId>license-maven-plugin</artifactId>
				<version>2.6.0</version>
				<configuration>
					<sortArtifactByName>true</sortArtifactByName>
					<licenseMerges>
						<licenseMerge>The Apache Software License, Version 2.0|Apache License, Version 2.0|Apache Public License 2.0|Apache-2.0</licenseMerge>
					</licenseMerges>
					<excludedGroups>com\.bitwig.*|de\.mossgrabers.*</excludedGroups>
				</configuration>
				<executions>
					<execution>
						<id>add-third-party</id>
						<goals>
							<goal>add-third-party</goal>
						</goals>
					</execution>
				</executions>
			</plugin>

			<!-- Plugins without configuration but for version settings. -->
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-clean-plugin</artifactId>
				<version>3.5.0</version>
			</plugin>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-resources-plugin</artifactId>
				<version>3.3.1</version>
			</plugin>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-deploy-plugin</artifactId>
				<version>3.1.4</version>
			</plugin>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-install-plugin</artifactId>
				<version>3.1.4</version>
			</plugin>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-site-plugin</artifactId>
				<version>4.0.0-M6</version>
			</plugin>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-surefire-plugin</artifactId>
				<version>3.5.3</version>
			</plugin>

		</plugins>

	</build>

</project>


================================================
FILE: release-linux.sh
================================================
JAVA_HOME_USER=/home/$USER/java/jdk-21.0.4+7
JAVA_HOME_DEBIAN=/usr/lib/jvm/java-21-openjdk-amd64

if [ -d $JAVA_HOME_USER ]; then
    export JAVA_HOME=$JAVA_HOME_USER
elif [ -d $JAVA_HOME_DEBIAN ]; then
    export JAVA_HOME=$JAVA_HOME_DEBIAN
fi

mvn clean install package -Dbitwig.extension.directory=target



================================================
FILE: release-macos.sh
================================================
export JAVA_HOME=/Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home
mvn clean install package -Dbitwig.extension.directory=target


================================================
FILE: release-windows.cmd
================================================
set JAVA_HOME=%JAVA_HOME21%
mvn clean install package -Dbitwig.extension.directory=target



================================================
FILE: maven-local-repository/de/mossgrabers/nativefilechooser/maven-metadata.xml
================================================
<?xml version="1.0" encoding="UTF-8"?>
<metadata>
  <groupId>de.mossgrabers</groupId>
  <artifactId>nativefilechooser</artifactId>
  <versioning>
    <release>1.3.3</release>
    <versions>
      <version>1.3.3</version>
    </versions>
    <lastUpdated>20250425180208</lastUpdated>
  </versioning>
</metadata>



================================================
FILE: maven-local-repository/de/mossgrabers/nativefilechooser/maven-metadata.xml.md5
================================================
9dc1754e8fa5f5f2a0d3e7773bde118e


================================================
FILE: maven-local-repository/de/mossgrabers/nativefilechooser/maven-metadata.xml.sha1
================================================
8a9b0ff1536699b81df51f6825b691dd0ccb4c27


================================================
FILE: maven-local-repository/de/mossgrabers/nativefilechooser/1.3.3/nativefilechooser-1.3.3.jar.md5
================================================
4c5cbd4bc1f21130b77b9d5f1a3a1c83


================================================
FILE: maven-local-repository/de/mossgrabers/nativefilechooser/1.3.3/nativefilechooser-1.3.3.jar.sha1
================================================
e0da8c84ea5deee15f158bd4960c16936b47578e


================================================
FILE: maven-local-repository/de/mossgrabers/nativefilechooser/1.3.3/nativefilechooser-1.3.3.pom
================================================
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<artifactId>nativefilechooser</artifactId>
	<groupId>de.mossgrabers</groupId>
	<packaging>jar</packaging>
	<name>NativeFileChooser</name>
	<version>1.3.3</version>

	<properties>
		<project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
	</properties>

	<licenses>
		<license>
			<name>LGPL-2.1-or-later</name>
			<url>https://www.gnu.org/licenses/old-licenses/lgpl-2.1</url>
			<distribution>repo</distribution>
		</license>
	</licenses>

	<repositories>
		<repository>
			<id>MavenCentral</id>
			<name>Maven Central Repository</name>
			<url>https://mvnrepository.com</url>
		</repository>
	</repositories>

	<dependencies>
		<dependency>
			<groupId>net.java.dev.jna</groupId>
			<artifactId>jna</artifactId>
			<version>5.17.0</version>
		</dependency>
		<dependency>
			<groupId>net.java.dev.jna</groupId>
			<artifactId>jna-platform</artifactId>
			<version>5.17.0</version>
		</dependency>
	</dependencies>

	<build>
		<plugins>

			<!-- Enforce a minimum Maven version -->
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-enforcer-plugin</artifactId>
				<version>3.5.0</version>
				<executions>
					<execution>
						<id>enforce-maven</id>
						<goals>
							<goal>enforce</goal>
						</goals>
						<configuration>
							<rules>
								<requireMavenVersion>
									<version>3.6.3</version>
								</requireMavenVersion>
							</rules>
						</configuration>
					</execution>
				</executions>
			</plugin>

			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-compiler-plugin</artifactId>
				<version>3.14.0</version>
				<configuration>
					<fork>true</fork>
					<source>17</source>
					<target>17</target>
					<encoding>UTF-8</encoding>
				</configuration>
			</plugin>

			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-source-plugin</artifactId>
				<version>3.3.1</version>
				<executions>
					<execution>
						<goals>
							<goal>jar-no-fork</goal>
						</goals>
					</execution>
				</executions>
			</plugin>

			<!-- Check for outdated libraries -->
			<plugin>
				<groupId>org.codehaus.mojo</groupId>
				<artifactId>versions-maven-plugin</artifactId>
				<version>2.18.0</version>
				<configuration>
					<ignoredVersions>.*-M.*,.*-alpha.*,.*-beta.*,.*-ea.*,.*-rc.*</ignoredVersions>
					<generateBackupPoms>false</generateBackupPoms>
				</configuration>
			</plugin>

			<!-- Plugins without configuration but for version settings. -->
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-clean-plugin</artifactId>
				<version>3.4.1</version>
			</plugin>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-deploy-plugin</artifactId>
				<version>3.1.4</version>
			</plugin>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-install-plugin</artifactId>
				<version>3.1.4</version>
			</plugin>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-jar-plugin</artifactId>
				<version>3.4.2</version>
			</plugin>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-resources-plugin</artifactId>
				<version>3.3.1</version>
			</plugin>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-site-plugin</artifactId>
				<version>3.21.0</version>
			</plugin>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-surefire-plugin</artifactId>
				<version>3.5.3</version>
			</plugin>

		</plugins>

	</build>

</project>


================================================
FILE: maven-local-repository/de/mossgrabers/nativefilechooser/1.3.3/nativefilechooser-1.3.3.pom.md5
================================================
9e01817893c558dde644774ce073416b


================================================
FILE: maven-local-repository/de/mossgrabers/nativefilechooser/1.3.3/nativefilechooser-1.3.3.pom.sha1
================================================
2c70de30f2a1e89ec6a0239eaa415daac651f5b7


================================================
FILE: maven-local-repository/purejavahidapi/purejavahidapi/maven-metadata.xml
================================================
<?xml version="1.0" encoding="UTF-8"?>
<metadata>
  <groupId>purejavahidapi</groupId>
  <artifactId>purejavahidapi</artifactId>
  <versioning>
    <release>0.0.23</release>
    <versions>
      <version>0.0.23</version>
    </versions>
    <lastUpdated>20250425174052</lastUpdated>
  </versioning>
</metadata>



================================================
FILE: maven-local-repository/purejavahidapi/purejavahidapi/maven-metadata.xml.md5
================================================
51fefc3954e82987e341ba807c7d6a84


================================================
FILE: maven-local-repository/purejavahidapi/purejavahidapi/maven-metadata.xml.sha1
================================================
b23a4e7600ad45a7724b54e23716217ef8c4b08c


================================================
FILE: maven-local-repository/purejavahidapi/purejavahidapi/0.0.23/purejavahidapi-0.0.23-javadoc.jar.md5
================================================
c816c6a78d66039bb44b08190681a991


================================================
FILE: maven-local-repository/purejavahidapi/purejavahidapi/0.0.23/purejavahidapi-0.0.23-javadoc.jar.sha1
================================================
aec64b8b0e57921019f9cf96bc8a4fa518a89f65


================================================
FILE: maven-local-repository/purejavahidapi/purejavahidapi/0.0.23/purejavahidapi-0.0.23-sources.jar.md5
================================================
bcc1dc6e65ced70ea7216232321d8c5e


================================================
FILE: maven-local-repository/purejavahidapi/purejavahidapi/0.0.23/purejavahidapi-0.0.23-sources.jar.sha1
================================================
5e4b0d7bba6ddb50611928b9c0faf2f817d4cfc2


================================================
FILE: maven-local-repository/purejavahidapi/purejavahidapi/0.0.23/purejavahidapi-0.0.23.jar.md5
================================================
c1b802c2b08002445545e54f9900eb51


================================================
FILE: maven-local-repository/purejavahidapi/purejavahidapi/0.0.23/purejavahidapi-0.0.23.jar.sha1
================================================
798f6db5de605784c7ff34da920d141b0e64abb8


================================================
FILE: maven-local-repository/purejavahidapi/purejavahidapi/0.0.23/purejavahidapi-0.0.23.pom
================================================
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>

	<groupId>purejavahidapi</groupId>
	<artifactId>purejavahidapi</artifactId>
	<version>0.0.23</version>
	<packaging>jar</packaging>

	<name>Pure Java HID-API</name>
	<url>https://github.com/nyholku/purejavahidapi</url>

	<licenses>
		<license>
			<name>BSD License 2.0</name>
			<url>https://opensource.org/licenses/BSD-3-Clause</url>
			<distribution>repo</distribution>
		</license>
	</licenses>

	<properties>
		<project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
		<project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
	</properties>

	<dependencies>
		<dependency>
			<groupId>net.java.dev.jna</groupId>
			<artifactId>jna-platform</artifactId>
			<version>5.17.0</version>
		</dependency>
		<dependency>
			<groupId>net.java.dev.jna</groupId>
			<artifactId>jna</artifactId>
			<version>5.17.0</version>
		</dependency>
	</dependencies>

	<build>
		<sourceDirectory>src</sourceDirectory>
		<plugins>
			<!-- Enforce a minimum Maven version -->
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-enforcer-plugin</artifactId>
				<version>3.5.0</version>
				<executions>
					<execution>
						<id>enforce-maven</id>
						<goals>
							<goal>enforce</goal>
						</goals>
						<configuration>
							<rules>
								<requireMavenVersion>
									<version>3.6.3</version>
								</requireMavenVersion>
							</rules>
						</configuration>
					</execution>
				</executions>
			</plugin>
			<plugin>
				<artifactId>maven-compiler-plugin</artifactId>
				<version>3.14.0</version>
				<configuration>
					<source>21</source>
					<target>21</target>
					<fork>true</fork>
					<proc>none</proc>
				</configuration>
			</plugin>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-jar-plugin</artifactId>
				<version>3.4.2</version>
				<configuration>
					<archive>
						<manifest>
							<addDefaultImplementationEntries>true</addDefaultImplementationEntries>
						</manifest>
					</archive>
				</configuration>
			</plugin>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-source-plugin</artifactId>
				<version>3.3.1</version>
				<executions>
					<execution>
						<id>attach-sources</id>
						<goals>
							<goal>jar</goal>
						</goals>
					</execution>
				</executions>
			</plugin>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-javadoc-plugin</artifactId>
				<version>3.11.2</version>
				<executions>
					<execution>
						<id>attach-javadocs</id>
						<goals>
							<goal>jar</goal>
						</goals>
					</execution>
				</executions>
			</plugin>

			<!-- Check for outdated libraries -->
			<plugin>
				<groupId>org.codehaus.mojo</groupId>
				<artifactId>versions-maven-plugin</artifactId>
				<version>2.18.0</version>
				<configuration>
					<ignoredVersions>.*-M.*,.*-alpha.*,.*-beta.*,.*-ea.*,.*-rc.*</ignoredVersions>
					<generateBackupPoms>false</generateBackupPoms>
				</configuration>
			</plugin>

			<!-- Plugins without configuration but for version settings. -->
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-clean-plugin</artifactId>
				<version>3.4.1</version>
			</plugin>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-resources-plugin</artifactId>
				<version>3.3.1</version>
			</plugin>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-deploy-plugin</artifactId>
				<version>3.1.4</version>
			</plugin>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-install-plugin</artifactId>
				<version>3.1.4</version>
			</plugin>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-site-plugin</artifactId>
				<version>3.21.0</version>
			</plugin>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-surefire-plugin</artifactId>
				<version>3.5.3</version>
			</plugin>

		</plugins>
	</build>
</project>



================================================
FILE: maven-local-repository/purejavahidapi/purejavahidapi/0.0.23/purejavahidapi-0.0.23.pom.md5
================================================
3024581baad70bb5fc665573ed47b709


================================================
FILE: maven-local-repository/purejavahidapi/purejavahidapi/0.0.23/purejavahidapi-0.0.23.pom.sha1
================================================
32930a16fd89d76beb335fbff2e2a8efc39e6931


================================================
FILE: resources/99-userusbdevices.rules
================================================
SUBSYSTEM=="usb",ATTR{idVendor}=="2982",ATTR{idProduct}=="1967",MODE="0660",GROUP="audio"
SUBSYSTEM=="usb",ATTR{idVendor}=="2982",ATTR{idProduct}=="1969",MODE="0660",GROUP="audio"
SUBSYSTEMS=="usb",ATTRS{idVendor}=="17cc",ATTRS{idProduct}=="1340",MODE="0660",GROUP="audio"
SUBSYSTEMS=="usb",ATTRS{idVendor}=="17cc",ATTRS{idProduct}=="1350",MODE="0660",GROUP="audio"
SUBSYSTEMS=="usb",ATTRS{idVendor}=="17cc",ATTRS{idProduct}=="1360",MODE="0660",GROUP="audio"
SUBSYSTEMS=="usb",ATTRS{idVendor}=="17cc",ATTRS{idProduct}=="1410",MODE="0660",GROUP="audio"



================================================
FILE: resources/Beatstep/DrivenByMoss.beatstep
================================================
{
	"device": "BeatStep",
	"0_82": 60,
	"0_83": 127,
	"10_80": 21,
	"10_82": 60,
	"10_83": 127,
	"112_1": 9,
	"112_2": 65,
	"112_3": 44,
	"112_4": 0,
	"112_5": 127,
	"112_6": 1,
	"113_1": 9,
	"113_2": 65,
	"113_3": 45,
	"113_4": 0,
	"113_5": 127,
	"113_6": 1,
	"114_1": 9,
	"114_2": 65,
	"114_3": 46,
	"114_4": 0,
	"114_5": 127,
	"114_6": 1,
	"115_1": 9,
	"115_2": 65,
	"115_3": 47,
	"115_4": 0,
	"115_5": 127,
	"115_6": 1,
	"116_1": 9,
	"116_2": 65,
	"116_3": 48,
	"116_4": 0,
	"116_5": 127,
	"116_6": 1,
	"117_1": 9,
	"117_2": 65,
	"117_3": 49,
	"117_4": 0,
	"117_5": 127,
	"117_6": 1,
	"118_1": 9,
	"118_2": 65,
	"118_3": 50,
	"118_4": 0,
	"118_5": 127,
	"118_6": 1,
	"119_1": 9,
	"119_2": 65,
	"119_3": 51,
	"119_4": 0,
	"119_5": 127,
	"119_6": 1,
	"11_80": 10,
	"11_82": 60,
	"11_83": 127,
	"120_1": 9,
	"120_2": 65,
	"120_3": 36,
	"120_4": 0,
	"120_5": 127,
	"120_6": 1,
	"121_1": 9,
	"121_2": 65,
	"121_3": 37,
	"121_4": 0,
	"121_5": 127,
	"121_6": 1,
	"122_1": 9,
	"122_2": 65,
	"122_3": 38,
	"122_4": 0,
	"122_5": 127,
	"122_6": 1,
	"123_1": 9,
	"123_2": 65,
	"123_3": 39,
	"123_4": 0,
	"123_5": 127,
	"123_6": 1,
	"124_1": 9,
	"124_2": 65,
	"124_3": 40,
	"124_4": 0,
	"124_5": 127,
	"124_6": 1,
	"125_1": 9,
	"125_2": 65,
	"125_3": 41,
	"125_4": 0,
	"125_5": 127,
	"125_6": 1,
	"126_1": 9,
	"126_2": 65,
	"126_3": 42,
	"126_4": 0,
	"126_5": 127,
	"126_6": 1,
	"127_1": 9,
	"127_2": 65,
	"127_3": 43,
	"127_4": 0,
	"127_5": 127,
	"127_6": 1,
	"12_80": 1,
	"12_82": 60,
	"12_83": 127,
	"13_82": 60,
	"13_83": 127,
	"14_82": 60,
	"14_83": 127,
	"15_82": 60,
	"15_83": 127,
	"1_80": 0,
	"1_82": 60,
	"1_83": 127,
	"2_80": 60,
	"2_82": 60,
	"2_83": 127,
	"32_1": 1,
	"32_2": 65,
	"32_3": 20,
	"32_4": 0,
	"32_5": 127,
	"32_6": 1,
	"33_1": 1,
	"33_2": 65,
	"33_3": 21,
	"33_4": 0,
	"33_5": 127,
	"33_6": 1,
	"34_1": 1,
	"34_2": 65,
	"34_3": 22,
	"34_4": 0,
	"34_5": 127,
	"34_6": 1,
	"35_1": 1,
	"35_2": 65,
	"35_3": 23,
	"35_4": 0,
	"35_5": 127,
	"35_6": 1,
	"36_1": 1,
	"36_2": 65,
	"36_3": 24,
	"36_4": 0,
	"36_5": 127,
	"36_6": 1,
	"37_1": 1,
	"37_2": 65,
	"37_3": 25,
	"37_4": 0,
	"37_5": 127,
	"37_6": 1,
	"38_1": 1,
	"38_2": 65,
	"38_3": 26,
	"38_4": 0,
	"38_5": 127,
	"38_6": 1,
	"39_1": 1,
	"39_2": 65,
	"39_3": 27,
	"39_4": 0,
	"39_5": 127,
	"39_6": 1,
	"3_65": 0,
	"3_80": 0,
	"3_82": 60,
	"3_83": 127,
	"40_1": 1,
	"40_2": 65,
	"40_3": 30,
	"40_4": 0,
	"40_5": 127,
	"40_6": 1,
	"41_1": 1,
	"41_2": 65,
	"41_3": 31,
	"41_4": 0,
	"41_5": 127,
	"41_6": 1,
	"42_1": 1,
	"42_2": 65,
	"42_3": 32,
	"42_4": 0,
	"42_5": 127,
	"42_6": 1,
	"43_1": 1,
	"43_2": 65,
	"43_3": 33,
	"43_4": 0,
	"43_5": 127,
	"43_6": 1,
	"44_1": 1,
	"44_2": 65,
	"44_3": 34,
	"44_4": 0,
	"44_5": 127,
	"44_6": 1,
	"45_1": 1,
	"45_2": 65,
	"45_3": 35,
	"45_4": 0,
	"45_5": 127,
	"45_6": 1,
	"46_1": 1,
	"46_2": 65,
	"46_3": 36,
	"46_4": 0,
	"46_5": 127,
	"46_6": 1,
	"47_1": 1,
	"47_2": 65,
	"47_3": 37,
	"47_4": 0,
	"47_5": 127,
	"47_6": 1,
	"48_1": 1,
	"48_2": 65,
	"48_3": 40,
	"48_4": 0,
	"48_5": 127,
	"48_6": 1,
	"4_65": 2,
	"4_80": 0,
	"4_82": 60,
	"4_83": 127,
	"5_80": 2,
	"5_82": 60,
	"5_83": 127,
	"6_64": 2,
	"6_80": 16,
	"6_82": 60,
	"6_83": 127,
	"7_80": 50,
	"7_82": 60,
	"7_83": 127,
	"88_1": 7,
	"88_2": 0,
	"88_3": 2,
	"88_4": 0,
	"88_5": 127,
	"88_6": 0,
	"89_1": 7,
	"89_2": 0,
	"89_3": 1,
	"89_4": 0,
	"89_5": 127,
	"89_6": 0,
	"8_80": 50,
	"8_82": 60,
	"8_83": 127,
	"9_80": 0,
	"9_82": 60,
	"9_83": 127,

}


================================================
FILE: resources/GenericFlexi/Example.programs
================================================
$BANK=Bass 1$MSB=0$LSB=0$CHANNEL=0
01 12 dB Goodness
02 3 PMC
03 Acid RE Flux
04 Aftertouch
05 AlphaBass
06 Attacker
07 Baby Making Bass
08 BackToTheCore
09 BasicAlbert
10 BassAndFX
11 Bassics
12 Blazing Blades
13 Bottom Bumps
14 Brainfeeder
15 ClassicFifth
16 Dark Side Bass
$BANK=Bass 2$MSB=1$LSB=0$CHANNEL=0
01 DualfiltersBss
02 DubMoverBass
03 ELP Brain BASS
04 First Rep Bass
05 Fixed Sync Bass
06 FunkyBass
07 LongPlay
08 MG Fat Bass
09 MegaRave
10 NeuroFCK
11 Neurotic
12 Noisy Bass
13 Ollie Open
14 Sharp Cream
15 Sharpaf
16 Sharpy
$BANK=Pads$MSB=2$LSB=0$CHANNEL=0
01 Metalizer
02 JMsPowerChord
03 Broken
04 Asian Modwheel
05 Classic sauce
06 FallingFifth
07 LostSync
08 Orgasines
09 
10 
11 
12 
13 Nostalgic String
14 AlivePad
15 JMsPad
16 Major


================================================
FILE: resources/Maschine Mikro Mk3/DrivenByMoss.ncmm3
================================================
<?xml version="1.0"?>
<ni-controller-midi-map version="1">
  <midi-map type="MaschineMikroMK3" name="DrivenByMoss" port="internal">
    <handleGroupControls />
    <velocitycurve>3</velocitycurve>
    <handleTransport>0</handleTransport>
    <wrapmode>0</wrapmode>
    <controls>
      <button version="1" id="Auto">
        <controller>35</controller>
        <channel>0</channel>
        <off>0</off>
        <on>127</on>
        <behavior>gate</behavior>
        <reaction>ondown</reaction>
      </button>
      <button version="1" id="Browser">
        <controller>40</controller>
        <channel>0</channel>
        <off>0</off>
        <on>127</on>
        <behavior>gate</behavior>
        <reaction>ondown</reaction>
      </button>
      <button version="1" id="Chords">
        <controller>84</controller>
        <channel>0</channel>
        <off>0</off>
        <on>127</on>
        <behavior>gate</behavior>
        <reaction>ondown</reaction>
      </button>
      <button version="1" id="Duplicate">
        <controller>89</controller>
        <channel>0</channel>
        <off>0</off>
        <on>127</on>
        <behavior>gate</behavior>
        <reaction>ondown</reaction>
      </button>
      <button version="1" id="Erase">
        <controller>54</controller>
        <channel>0</channel>
        <off>0</off>
        <on>127</on>
        <behavior>gate</behavior>
        <reaction>ondown</reaction>
      </button>
      <button version="1" id="Events">
        <controller>87</controller>
        <channel>0</channel>
        <off>0</off>
        <on>127</on>
        <behavior>gate</behavior>
        <reaction>ondown</reaction>
      </button>
      <button version="1" id="FixedVel">
        <controller>80</controller>
        <channel>0</channel>
        <off>0</off>
        <on>127</on>
        <behavior>gate</behavior>
        <reaction>ondown</reaction>
      </button>
      <button version="1" id="Follow">
        <controller>56</controller>
        <channel>0</channel>
        <off>0</off>
        <on>127</on>
        <behavior>gate</behavior>
        <reaction>ondown</reaction>
      </button>
      <button version="1" id="Group">
        <controller>34</controller>
        <channel>0</channel>
        <off>0</off>
        <on>127</on>
        <behavior>gate</behavior>
        <reaction>ondown</reaction>
      </button>
      <button version="1" id="Keyboard">
        <controller>82</controller>
        <channel>0</channel>
        <off>0</off>
        <on>127</on>
        <behavior>gate</behavior>
        <reaction>ondown</reaction>
      </button>
      <button version="1" id="Lock">
        <controller>36</controller>
        <channel>0</channel>
        <off>0</off>
        <on>127</on>
        <behavior>gate</behavior>
        <reaction>ondown</reaction>
      </button>
      <button version="1" id="Maschine">
        <controller>38</controller>
        <channel>0</channel>
        <off>0</off>
        <on>127</on>
        <behavior>gate</behavior>
        <reaction>ondown</reaction>
      </button>
      <button version="1" id="Mod">
        <controller>50</controller>
        <channel>0</channel>
        <off>0</off>
        <on>127</on>
        <behavior>gate</behavior>
        <reaction>ondown</reaction>
      </button>
      <button version="1" id="Mute">
        <controller>92</controller>
        <channel>0</channel>
        <off>0</off>
        <on>127</on>
        <behavior>gate</behavior>
        <reaction>ondown</reaction>
      </button>
      <wheel version="1" id="Navigation">
        <controller mode="comp">7</controller>
        <channel>0</channel>
        <min>0</min>
        <max>127</max>
        <default>0</default>
      </wheel>
      <button version="1" id="Navigation Push">
        <controller>8</controller>
        <channel>0</channel>
        <off>0</off>
        <on>127</on>
        <behavior onIfDown="on">gate</behavior>
        <reaction>ondown</reaction>
      </button>
      <button version="1" id="Navigation Touch">
        <controller>9</controller>
        <channel>0</channel>
        <off>0</off>
        <on>127</on>
        <behavior onIfDown="on">gate</behavior>
        <reaction>ondown</reaction>
      </button>
      <button version="1" id="NoteRep">
        <controller>37</controller>
        <channel>0</channel>
        <off>0</off>
        <on>127</on>
        <behavior>gate</behavior>
        <reaction>ondown</reaction>
      </button>
      <button version="1" id="Notes">
        <controller>52</controller>
        <channel>0</channel>
        <off>0</off>
        <on>127</on>
        <behavior>gate</behavior>
        <reaction>ondown</reaction>
      </button>
      <button version="1" id="PadMode">
        <controller>81</controller>
        <channel>0</channel>
        <off>0</off>
        <on>127</on>
        <behavior>gate</behavior>
        <reaction>ondown</reaction>
      </button>
      <button version="1" id="Pattern">
        <controller>86</controller>
        <channel>0</channel>
        <off>0</off>
        <on>127</on>
        <behavior>gate</behavior>
        <reaction>ondown</reaction>
      </button>
      <button version="1" id="Perform">
        <controller>51</controller>
        <channel>0</channel>
        <off>0</off>
        <on>127</on>
        <behavior>gate</behavior>
        <reaction>ondown</reaction>
      </button>
      <button version="1" id="Pitch">
        <controller>49</controller>
        <channel>0</channel>
        <off>0</off>
        <on>127</on>
        <behavior>gate</behavior>
        <reaction>ondown</reaction>
      </button>
      <button version="1" id="Play">
        <controller>57</controller>
        <channel>0</channel>
        <off>0</off>
        <on>127</on>
        <behavior>gate</behavior>
        <reaction>ondown</reaction>
      </button>
      <button version="1" id="Plugin">
        <controller>45</controller>
        <channel>0</channel>
        <off>0</off>
        <on>127</on>
        <behavior>gate</behavior>
        <reaction>ondown</reaction>
      </button>
      <button version="1" id="Rec">
        <controller>58</controller>
        <channel>0</channel>
        <off>0</off>
        <on>127</on>
        <behavior>gate</behavior>
        <reaction>ondown</reaction>
      </button>
      <button version="1" id="Restart">
        <controller>53</controller>
        <channel>0</channel>
        <off>0</off>
        <on>127</on>
        <behavior>gate</behavior>
        <reaction>ondown</reaction>
      </button>
      <button version="1" id="Sampling">
        <controller>47</controller>
        <channel>0</channel>
        <off>0</off>
        <on>127</on>
        <behavior>gate</behavior>
        <reaction>ondown</reaction>
      </button>
      <button version="1" id="Scene">
        <controller>85</controller>
        <channel>0</channel>
        <off>0</off>
        <on>127</on>
        <behavior>gate</behavior>
        <reaction>ondown</reaction>
      </button>
      <button version="1" id="Select">
        <controller>90</controller>
        <channel>0</channel>
        <off>0</off>
        <on>127</on>
        <behavior>gate</behavior>
        <reaction>ondown</reaction>
      </button>
      <button version="1" id="Solo">
        <controller>91</controller>
        <channel>0</channel>
        <off>0</off>
        <on>127</on>
        <behavior>gate</behavior>
        <reaction>ondown</reaction>
      </button>
      <button version="1" id="Star">
        <controller>39</controller>
        <channel>0</channel>
        <off>0</off>
        <on>127</on>
        <behavior>gate</behavior>
        <reaction>ondown</reaction>
      </button>
      <button version="1" id="Step">
        <controller>83</controller>
        <channel>0</channel>
        <off>0</off>
        <on>127</on>
        <behavior>gate</behavior>
        <reaction>ondown</reaction>
      </button>
      <button version="1" id="Stop">
        <controller>59</controller>
        <channel>0</channel>
        <off>0</off>
        <on>127</on>
        <behavior>gate</behavior>
        <reaction>ondown</reaction>
      </button>
      <button version="1" id="Swing">
        <controller>46</controller>
        <channel>0</channel>
        <off>0</off>
        <on>127</on>
        <behavior>gate</behavior>
        <reaction>ondown</reaction>
      </button>
      <button version="1" id="Tap">
        <controller>55</controller>
        <channel>0</channel>
        <off>0</off>
        <on>127</on>
        <behavior>gate</behavior>
        <reaction>ondown</reaction>
      </button>
      <button version="1" id="Tempo">
        <controller>48</controller>
        <channel>0</channel>
        <off>0</off>
        <on>127</on>
        <behavior>gate</behavior>
        <reaction>ondown</reaction>
      </button>
      <knob version="1" id="Touchstrip">
        <controller>1</controller>
        <channel>0</channel>
        <min>0</min>
        <max>127</max>
        <default>0</default>
        <range>360</range>
        <steps>20</steps>
        <bipolar>off</bipolar>
        <min>0</min>
        <max>127</max>
        <ledPattern>0</ledPattern>
        <behavior>none</behavior>
      </knob>
      <button version="1" id="TouchstripCap">
        <controller>2</controller>
        <channel>0</channel>
        <off>0</off>
        <on>127</on>
        <behavior onIfDown="on">gate</behavior>
        <reaction>ondown</reaction>
      </button>
      <led version="1" id="TouchstripIDX">
        <display type="0">
          <unit color-type="1" color-mode="0" color-on-index="18" color-off-index="1" />
        </display>
        <controller>1</controller>
        <channel>0</channel>
        <min>0</min>
        <max>127</max>
        <default>0</default>
      </led>
      <button version="1" id="Variation">
        <controller>88</controller>
        <channel>0</channel>
        <off>0</off>
        <on>127</on>
        <behavior>gate</behavior>
        <reaction>ondown</reaction>
      </button>
      <button version="1" id="Volume">
        <controller>44</controller>
        <channel>0</channel>
        <off>0</off>
        <on>127</on>
        <behavior>gate</behavior>
        <reaction>ondown</reaction>
      </button>
    </controls>
    <pages>
      <current_index>0</current_index>
      <page name="Knob Page" />
    </pages>
    <groups>
      <current_index>0</current_index>
      <group name="Pad Page" color-index="5">
        <pad subtype="trigger" version="1" id="Pad1">
          <note>36</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior>gate</behavior>
          <reaction>ondown</reaction>
        </pad>
        <pad subtype="trigger" version="1" id="Pad10">
          <note>45</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior>gate</behavior>
          <reaction>ondown</reaction>
        </pad>
        <led version="1" id="Pad10IDX">
          <display type="0">
            <unit color-type="1" color-mode="3" color-on-index="2" color-off-index="1" />
          </display>
          <note>45</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
        </led>
        <pad subtype="trigger" version="1" id="Pad11">
          <note>46</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior>gate</behavior>
          <reaction>ondown</reaction>
        </pad>
        <led version="1" id="Pad11IDX">
          <display type="0">
            <unit color-type="1" color-mode="3" color-on-index="2" color-off-index="1" />
          </display>
          <note>46</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
        </led>
        <pad subtype="trigger" version="1" id="Pad12">
          <note>47</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior>gate</behavior>
          <reaction>ondown</reaction>
        </pad>
        <led version="1" id="Pad12IDX">
          <display type="0">
            <unit color-type="1" color-mode="3" color-on-index="2" color-off-index="1" />
          </display>
          <note>47</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
        </led>
        <pad subtype="trigger" version="1" id="Pad13">
          <note>48</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior>gate</behavior>
          <reaction>ondown</reaction>
        </pad>
        <led version="1" id="Pad13IDX">
          <display type="0">
            <unit color-type="1" color-mode="3" color-on-index="2" color-off-index="1" />
          </display>
          <note>48</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
        </led>
        <pad subtype="trigger" version="1" id="Pad14">
          <note>49</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior>gate</behavior>
          <reaction>ondown</reaction>
        </pad>
        <led version="1" id="Pad14IDX">
          <display type="0">
            <unit color-type="1" color-mode="3" color-on-index="2" color-off-index="1" />
          </display>
          <note>49</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
        </led>
        <pad subtype="trigger" version="1" id="Pad15">
          <note>50</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior>gate</behavior>
          <reaction>ondown</reaction>
        </pad>
        <led version="1" id="Pad15IDX">
          <display type="0">
            <unit color-type="1" color-mode="3" color-on-index="2" color-off-index="1" />
          </display>
          <note>50</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
        </led>
        <pad subtype="trigger" version="1" id="Pad16">
          <note>51</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior>gate</behavior>
          <reaction>ondown</reaction>
        </pad>
        <led version="1" id="Pad16IDX">
          <display type="0">
            <unit color-type="1" color-mode="3" color-on-index="2" color-off-index="1" />
          </display>
          <note>51</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
        </led>
        <led version="1" id="Pad1IDX">
          <display type="0">
            <unit color-type="1" color-mode="3" color-on-index="2" color-off-index="1" />
          </display>
          <note>36</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
        </led>
        <pad subtype="trigger" version="1" id="Pad2">
          <note>37</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior>gate</behavior>
          <reaction>ondown</reaction>
        </pad>
        <led version="1" id="Pad2IDX">
          <display type="0">
            <unit color-type="1" color-mode="3" color-on-index="2" color-off-index="1" />
          </display>
          <note>37</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
        </led>
        <pad subtype="trigger" version="1" id="Pad3">
          <note>38</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior>gate</behavior>
          <reaction>ondown</reaction>
        </pad>
        <led version="1" id="Pad3IDX">
          <display type="0">
            <unit color-type="1" color-mode="3" color-on-index="2" color-off-index="1" />
          </display>
          <note>38</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
        </led>
        <pad subtype="trigger" version="1" id="Pad4">
          <note>39</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior>gate</behavior>
          <reaction>ondown</reaction>
        </pad>
        <led version="1" id="Pad4IDX">
          <display type="0">
            <unit color-type="1" color-mode="3" color-on-index="2" color-off-index="1" />
          </display>
          <note>39</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
        </led>
        <pad subtype="trigger" version="1" id="Pad5">
          <note>40</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior>gate</behavior>
          <reaction>ondown</reaction>
        </pad>
        <led version="1" id="Pad5IDX">
          <display type="0">
            <unit color-type="1" color-mode="3" color-on-index="2" color-off-index="1" />
          </display>
          <note>40</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
        </led>
        <pad subtype="trigger" version="1" id="Pad6">
          <note>41</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior>gate</behavior>
          <reaction>ondown</reaction>
        </pad>
        <led version="1" id="Pad6IDX">
          <display type="0">
            <unit color-type="1" color-mode="3" color-on-index="2" color-off-index="1" />
          </display>
          <note>41</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
        </led>
        <pad subtype="trigger" version="1" id="Pad7">
          <note>42</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior>gate</behavior>
          <reaction>ondown</reaction>
        </pad>
        <led version="1" id="Pad7IDX">
          <display type="0">
            <unit color-type="1" color-mode="3" color-on-index="2" color-off-index="1" />
          </display>
          <note>42</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
        </led>
        <pad subtype="trigger" version="1" id="Pad8">
          <note>43</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior>gate</behavior>
          <reaction>ondown</reaction>
        </pad>
        <led version="1" id="Pad8IDX">
          <display type="0">
            <unit color-type="1" color-mode="3" color-on-index="2" color-off-index="1" />
          </display>
          <note>43</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
        </led>
        <pad subtype="trigger" version="1" id="Pad9">
          <note>44</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior>gate</behavior>
          <reaction>ondown</reaction>
        </pad>
        <led version="1" id="Pad9IDX">
          <display type="0">
            <unit color-type="1" color-mode="3" color-on-index="2" color-off-index="1" />
          </display>
          <note>44</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
        </led>
        <pad subtype="pressure" version="1" id="Pressure1">
          <polyat>36</polyat>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">toggle</behavior>
          <reaction>ondown</reaction>
        </pad>
        <pad subtype="pressure" version="1" id="Pressure10">
          <polyat>45</polyat>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">toggle</behavior>
          <reaction>ondown</reaction>
        </pad>
        <pad subtype="pressure" version="1" id="Pressure11">
          <polyat>46</polyat>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">toggle</behavior>
          <reaction>ondown</reaction>
        </pad>
        <pad subtype="pressure" version="1" id="Pressure12">
          <polyat>47</polyat>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">toggle</behavior>
          <reaction>ondown</reaction>
        </pad>
        <pad subtype="pressure" version="1" id="Pressure13">
          <polyat>48</polyat>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">toggle</behavior>
          <reaction>ondown</reaction>
        </pad>
        <pad subtype="pressure" version="1" id="Pressure14">
          <polyat>49</polyat>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">toggle</behavior>
          <reaction>ondown</reaction>
        </pad>
        <pad subtype="pressure" version="1" id="Pressure15">
          <polyat>50</polyat>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">toggle</behavior>
          <reaction>ondown</reaction>
        </pad>
        <pad subtype="pressure" version="1" id="Pressure16">
          <polyat>51</polyat>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">toggle</behavior>
          <reaction>ondown</reaction>
        </pad>
        <pad subtype="pressure" version="1" id="Pressure2">
          <polyat>37</polyat>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">toggle</behavior>
          <reaction>ondown</reaction>
        </pad>
        <pad subtype="pressure" version="1" id="Pressure3">
          <polyat>38</polyat>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">toggle</behavior>
          <reaction>ondown</reaction>
        </pad>
        <pad subtype="pressure" version="1" id="Pressure4">
          <polyat>39</polyat>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">toggle</behavior>
          <reaction>ondown</reaction>
        </pad>
        <pad subtype="pressure" version="1" id="Pressure5">
          <polyat>40</polyat>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">toggle</behavior>
          <reaction>ondown</reaction>
        </pad>
        <pad subtype="pressure" version="1" id="Pressure6">
          <polyat>41</polyat>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">toggle</behavior>
          <reaction>ondown</reaction>
        </pad>
        <pad subtype="pressure" version="1" id="Pressure7">
          <polyat>42</polyat>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">toggle</behavior>
          <reaction>ondown</reaction>
        </pad>
        <pad subtype="pressure" version="1" id="Pressure8">
          <polyat>43</polyat>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">toggle</behavior>
          <reaction>ondown</reaction>
        </pad>
        <pad subtype="pressure" version="1" id="Pressure9">
          <polyat>44</polyat>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">toggle</behavior>
          <reaction>ondown</reaction>
        </pad>
      </group>
      <group name="Pad Page B" color-index="0">
        <pad subtype="trigger" version="1" id="Pad1">
          <note>36</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">gate</behavior>
          <reaction>ondown</reaction>
        </pad>
        <pad subtype="trigger" version="1" id="Pad10">
          <note>21</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">gate</behavior>
          <reaction>ondown</reaction>
        </pad>
        <led version="1" id="Pad10IDX">
          <display type="0">
            <unit color-type="1" color-mode="0" color-on-index="2" color-off-index="1" />
          </display>
          <note>21</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
        </led>
        <pad subtype="trigger" version="1" id="Pad11">
          <note>22</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">gate</behavior>
          <reaction>ondown</reaction>
        </pad>
        <led version="1" id="Pad11IDX">
          <display type="0">
            <unit color-type="1" color-mode="0" color-on-index="2" color-off-index="1" />
          </display>
          <note>22</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
        </led>
        <pad subtype="trigger" version="1" id="Pad12">
          <note>23</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">gate</behavior>
          <reaction>ondown</reaction>
        </pad>
        <led version="1" id="Pad12IDX">
          <display type="0">
            <unit color-type="1" color-mode="0" color-on-index="2" color-off-index="1" />
          </display>
          <note>23</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
        </led>
        <pad subtype="trigger" version="1" id="Pad13">
          <note>24</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">gate</behavior>
          <reaction>ondown</reaction>
        </pad>
        <led version="1" id="Pad13IDX">
          <display type="0">
            <unit color-type="1" color-mode="0" color-on-index="2" color-off-index="1" />
          </display>
          <note>24</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
        </led>
        <pad subtype="trigger" version="1" id="Pad14">
          <note>25</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">gate</behavior>
          <reaction>ondown</reaction>
        </pad>
        <led version="1" id="Pad14IDX">
          <display type="0">
            <unit color-type="1" color-mode="0" color-on-index="2" color-off-index="1" />
          </display>
          <note>25</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
        </led>
        <pad subtype="trigger" version="1" id="Pad15">
          <note>26</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">gate</behavior>
          <reaction>ondown</reaction>
        </pad>
        <led version="1" id="Pad15IDX">
          <display type="0">
            <unit color-type="1" color-mode="0" color-on-index="2" color-off-index="1" />
          </display>
          <note>26</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
        </led>
        <pad subtype="trigger" version="1" id="Pad16">
          <note>27</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">gate</behavior>
          <reaction>ondown</reaction>
        </pad>
        <led version="1" id="Pad16IDX">
          <display type="0">
            <unit color-type="1" color-mode="0" color-on-index="2" color-off-index="1" />
          </display>
          <note>27</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
        </led>
        <led version="1" id="Pad1IDX">
          <display type="0">
            <unit color-type="1" color-mode="0" color-on-index="2" color-off-index="1" />
          </display>
          <note>12</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
        </led>
        <pad subtype="trigger" version="1" id="Pad2">
          <note>13</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">gate</behavior>
          <reaction>ondown</reaction>
        </pad>
        <led version="1" id="Pad2IDX">
          <display type="0">
            <unit color-type="1" color-mode="0" color-on-index="2" color-off-index="1" />
          </display>
          <note>13</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
        </led>
        <pad subtype="trigger" version="1" id="Pad3">
          <note>14</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">gate</behavior>
          <reaction>ondown</reaction>
        </pad>
        <led version="1" id="Pad3IDX">
          <display type="0">
            <unit color-type="1" color-mode="0" color-on-index="2" color-off-index="1" />
          </display>
          <note>14</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
        </led>
        <pad subtype="trigger" version="1" id="Pad4">
          <note>15</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">gate</behavior>
          <reaction>ondown</reaction>
        </pad>
        <led version="1" id="Pad4IDX">
          <display type="0">
            <unit color-type="1" color-mode="0" color-on-index="2" color-off-index="1" />
          </display>
          <note>15</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
        </led>
        <pad subtype="trigger" version="1" id="Pad5">
          <note>16</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">gate</behavior>
          <reaction>ondown</reaction>
        </pad>
        <led version="1" id="Pad5IDX">
          <display type="0">
            <unit color-type="1" color-mode="0" color-on-index="2" color-off-index="1" />
          </display>
          <note>16</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
        </led>
        <pad subtype="trigger" version="1" id="Pad6">
          <note>17</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">gate</behavior>
          <reaction>ondown</reaction>
        </pad>
        <led version="1" id="Pad6IDX">
          <display type="0">
            <unit color-type="1" color-mode="0" color-on-index="2" color-off-index="1" />
          </display>
          <note>17</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
        </led>
        <pad subtype="trigger" version="1" id="Pad7">
          <note>18</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">gate</behavior>
          <reaction>ondown</reaction>
        </pad>
        <led version="1" id="Pad7IDX">
          <display type="0">
            <unit color-type="1" color-mode="0" color-on-index="2" color-off-index="1" />
          </display>
          <note>18</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
        </led>
        <pad subtype="trigger" version="1" id="Pad8">
          <note>19</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">gate</behavior>
          <reaction>ondown</reaction>
        </pad>
        <led version="1" id="Pad8IDX">
          <display type="0">
            <unit color-type="1" color-mode="0" color-on-index="2" color-off-index="1" />
          </display>
          <note>19</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
        </led>
        <pad subtype="trigger" version="1" id="Pad9">
          <note>20</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">gate</behavior>
          <reaction>ondown</reaction>
        </pad>
        <led version="1" id="Pad9IDX">
          <display type="0">
            <unit color-type="1" color-mode="0" color-on-index="2" color-off-index="1" />
          </display>
          <note>20</note>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
        </led>
        <pad subtype="pressure" version="1" id="Pressure1">
          <polyat>12</polyat>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">toggle</behavior>
          <reaction>ondown</reaction>
        </pad>
        <pad subtype="pressure" version="1" id="Pressure10">
          <polyat>21</polyat>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">toggle</behavior>
          <reaction>ondown</reaction>
        </pad>
        <pad subtype="pressure" version="1" id="Pressure11">
          <polyat>22</polyat>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">toggle</behavior>
          <reaction>ondown</reaction>
        </pad>
        <pad subtype="pressure" version="1" id="Pressure12">
          <polyat>23</polyat>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">toggle</behavior>
          <reaction>ondown</reaction>
        </pad>
        <pad subtype="pressure" version="1" id="Pressure13">
          <polyat>24</polyat>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">toggle</behavior>
          <reaction>ondown</reaction>
        </pad>
        <pad subtype="pressure" version="1" id="Pressure14">
          <polyat>25</polyat>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">toggle</behavior>
          <reaction>ondown</reaction>
        </pad>
        <pad subtype="pressure" version="1" id="Pressure15">
          <polyat>26</polyat>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">toggle</behavior>
          <reaction>ondown</reaction>
        </pad>
        <pad subtype="pressure" version="1" id="Pressure16">
          <polyat>27</polyat>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">toggle</behavior>
          <reaction>ondown</reaction>
        </pad>
        <pad subtype="pressure" version="1" id="Pressure2">
          <polyat>13</polyat>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">toggle</behavior>
          <reaction>ondown</reaction>
        </pad>
        <pad subtype="pressure" version="1" id="Pressure3">
          <polyat>14</polyat>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">toggle</behavior>
          <reaction>ondown</reaction>
        </pad>
        <pad subtype="pressure" version="1" id="Pressure4">
          <polyat>15</polyat>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">toggle</behavior>
          <reaction>ondown</reaction>
        </pad>
        <pad subtype="pressure" version="1" id="Pressure5">
          <polyat>16</polyat>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">toggle</behavior>
          <reaction>ondown</reaction>
        </pad>
        <pad subtype="pressure" version="1" id="Pressure6">
          <polyat>17</polyat>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">toggle</behavior>
          <reaction>ondown</reaction>
        </pad>
        <pad subtype="pressure" version="1" id="Pressure7">
          <polyat>18</polyat>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">toggle</behavior>
          <reaction>ondown</reaction>
        </pad>
        <pad subtype="pressure" version="1" id="Pressure8">
          <polyat>19</polyat>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">toggle</behavior>
          <reaction>ondown</reaction>
        </pad>
        <pad subtype="pressure" version="1" id="Pressure9">
          <polyat>20</polyat>
          <channel>0</channel>
          <min>0</min>
          <max>127</max>
          <default>0</default>
          <behavior onIfDown="on">toggle</behavior>
          <reaction>ondown</reaction>
        </pad>
      </group>
    </groups>
  </midi-map>
</ni-controller-midi-map>



================================================
FILE: resources/OSC/OpenStageControlEqualizer.json
================================================
{
  "version": "1.9.7",
  "type": "session",
  "createdWith": "Open Stage Control",
  "content": {
    "type": "root",
    "id": "root",
    "linkId": "",
    "css": "",
    "default": "",
    "value": "",
    "address": "/root",
    "preArgs": "",
    "target": "",
    "bypass": false,
    "traversing": false,
    "variables": {},
    "tabs": [
      {
        "type": "tab",
        "id": "tab_1",
        "linkId": "",
        "label": "auto",
        "css": "",
        "default": "",
        "value": "",
        "address": "/tab_1",
        "preArgs": "",
        "target": "",
        "bypass": false,
        "variables": "@{parent.variables}",
        "widgets": [
          {
            "type": "panel",
            "top": 0,
            "left": "auto",
            "id": "eq_strip",
            "linkId": "",
            "width": "100%",
            "height": "100%",
            "css": "",
            "scroll": true,
            "default": "",
            "value": "",
            "address": "/strip_1",
            "preArgs": "",
            "target": "",
            "bypass": false,
            "variables": "@{parent.variables}",
            "widgets": [
              {
                "type": "script",
                "id": "script_multixy_to_knobs",
                "linkId": "",
                "default": "",
                "value": "[@{multixy_1}, @{q_1}, @{q_2}, @{q_3}, @{q_4}, @{q_5}, @{q_6}, @{q_7}, @{q_8}]",
                "address": "/script_1",
                "preArgs": "",
                "target": "",
                "bypass": false,
                "script": "const NO_BANDS = 8;\n\nvar multiValue = value[0];\nvar filters = \"\";\n\nvar band;\nfor (band = 0; band < NO_BANDS; band++)\n{\n    var index = band * 2;\n    var freq = (multiValue[index] - 20) / (22000 - 20);\n    var ind = band + 1;\n    set(\"freq_\" + ind, freq * 127)\n    set(\"gain_\" + ind, multiValue[1 + index] + 64)\n\n    var qfactor = value[1 + band];\n    qfactor = (qfactor / 127.0) * 6 - 3;\n    qfactor = Math.pow(10, qfactor);\n\n    freq = freq * (Math.log10(22000) - Math.log10(20));\n    freq = Math.pow(10, Math.log10(20) + freq);\n\n    var type = get(\"type_\" + (band + 1));\n    if (type == \"highcut\")\n        type = \"lowpass\";\n    else if (type == \"lowcut\")\n        type = \"highpass\";\n    else if (type == \"bell\")\n        type = \"peak\";\n    if (type != \"off\")\n    {\n        if (band > 0)\n            filters += \",\";\n        filters += \"{ \\\"type\\\": \\\"\" + type + \"\\\", \\\"freq\\\": \\\"\" + freq + \"\\\", \\\"q\\\": \\\"\" + qfactor + \"\\\", \\\"gain\\\": \" + multiValue[1 + index] + \" }\";\n    }\n}\nset(\"variable_eq_filters\", \"[\" + filters + \"]\");",
                "decimals": 2,
                "event": "value",
                "keyBinding": "",
                "keyRepeat": true,
                "keyType": "keydown",
                "typeTags": "",
                "ignoreDefaults": false,
                "comments": ""
              },
              {
                "type": "variable",
                "id": "variable_eq_filters",
                "value": "",
                "default": "",
                "linkId": "",
                "script": "",
                "address": "auto",
                "preArgs": "",
                "typeTags": "",
                "target": "",
                "ignoreDefaults": false,
                "comments": "",
                "decimals": 2,
                "bypass": false
              },
              {
                "type": "panel",
                "widgets": [
                  {
                    "type": "eq",
                    "top": 0,
                    "left": 0,
                    "id": "eq_1",
                    "linkId": "",
                    "width": "auto",
                    "height": "auto",
                    "css": ":host {\nwidth:  100%;\nheight: 100%;\nmargin: 0rem;\n\nbackground:transparent;\n\npointer-events: none;\nz-index: 10000!important;\n--color-border: transparent!important;\n}\n\n.plot {\nbackground:transparent;\n--color-bg: transparent;\nborder:0;\nmargin:0;\npadding:3rem;\n}",
                    "default": "",
                    "value": "",
                    "address": "/eq_1",
                    "preArgs": "",
                    "pips": false,
                    "rangeY": {
                      "min": -63,
                      "max": 63
                    },
                    "origin": 0,
                    "visible": true,
                    "expand": "false",
                    "colorText": "auto",
                    "colorWidget": "auto",
                    "colorStroke": "auto",
                    "colorFill": "auto",
                    "alphaStroke": "auto",
                    "alphaFillOff": "auto",
                    "alphaFillOn": "auto",
                    "padding": "auto",
                    "filters": "@{variable_eq_filters}",
                    "rangeX": {
                      "min": 20,
                      "max": 22000
                    },
                    "script": "",
                    "target": "",
                    "comments": "",
                    "lineWidth": "auto",
                    "html": "",
                    "dots": false,
                    "bars": false
                  },
                  {
                    "type": "multixy",
                    "top": 0,
                    "left": 0,
                    "id": "multixy_1",
                    "linkId": "",
                    "width": "100%",
                    "height": "100%",
                    "css": "JS{{\nvar isOn1 = @{enable_1};\nvar isOn2 = @{enable_2};\nvar isOn3 = @{enable_3};\nvar isOn4 = @{enable_4};\nvar isOn5 = @{enable_5};\nvar isOn6 = @{enable_6};\nvar isOn7 = @{enable_7};\nvar isOn8 = @{enable_8};\n\nvar css = \"\";\nvar offCss = \"{--color-fill:gray;--color-stroke:gray} \";\nif (isOn1 == \"off\")\n    css+= \".pad-0\" + offCss;\nif (isOn2 == \"off\")\n    css+= \".pad-1\" + offCss;\nif (isOn3 == \"off\")\n    css+= \".pad-2\" + offCss;\nif (isOn4 == \"off\")\n    css+= \".pad-3\" + offCss;\nif (isOn5 == \"off\")\n    css+= \".pad-4\" + offCss;\nif (isOn6 == \"off\")\n    css+= \".pad-5\" + offCss;\nif (isOn7 == \"off\")\n    css+= \".pad-6\" + offCss;\nif (isOn8 == \"off\")\n    css+= \".pad-7\" + offCss;\nreturn css\n}}",
                    "default": "JS{{\nvar v = []\nfor (var i=0; i<@{this.points};i++){\nv.push(22000/(@{this.points}+1) * (i+1))\nv.push(0)\n}\nreturn v\n}}",
                    "value": "",
                    "address": "/multixy_1",
                    "preArgs": "",
                    "target": "",
                    "bypass": true,
                    "points": 8,
                    "pointSize": 10,
                    "snap": false,
                    "spring": false,
                    "pips": true,
                    "rangeX": {
                      "min": 20,
                      "max": 22000
                    },
                    "rangeY": {
                      "min": -63,
                      "max": 63
                    },
                    "logScaleX": false,
                    "logScaleY": false,
                    "sensitivity": 1,
                    "decimals": 2,
                    "visible": true,
                    "interaction": true,
                    "expand": "false",
                    "colorText": "auto",
                    "colorWidget": "auto",
                    "colorStroke": "auto",
                    "colorFill": "auto",
                    "alphaStroke": "auto",
                    "alphaFillOff": "auto",
                    "alphaFillOn": "auto",
                    "padding": "auto",
                    "script": "",
                    "typeTags": "",
                    "ignoreDefaults": false,
                    "comments": "",
                    "lineWidth": "auto",
                    "html": "",
                    "ephemeral": false
                  }
                ],
                "top": 10,
                "left": 200,
                "id": "panel_graphical_eq",
                "linkId": "",
                "width": "auto",
                "height": "70%",
                "css": "flex:1;",
                "scroll": true,
                "default": "",
                "value": "",
                "address": "/panel_1",
                "preArgs": "",
                "target": "",
                "bypass": false,
                "variables": "@{parent.variables}",
                "tabs": [],
                "decimals": 2,
                "innerPadding": false,
                "padding": 0,
                "alphaStroke": 0,
                "visible": true,
                "interaction": true,
                "expand": false,
                "colorBg": "auto",
                "colorText": "auto",
                "colorWidget": "auto",
                "colorStroke": "auto",
                "colorFill": "auto",
                "alphaFillOff": "auto",
                "alphaFillOn": "auto",
                "traversing": false,
                "layout": "default",
                "justify": "start",
                "gridTemplate": "",
                "verticalTabs": false,
                "script": "",
                "typeTags": "",
                "ignoreDefaults": false,
                "comments": "",
                "lineWidth": "auto",
                "html": "",
                "contain": true
              },
              {
                "type": "panel",
                "top": 10,
                "left": 30,
                "id": "panel_bands_controls",
                "visible": true,
                "interaction": true,
                "width": "auto",
                "height": "30%",
                "expand": false,
                "colorBg": "auto",
                "colorText": "auto",
                "colorWidget": "auto",
                "colorStroke": "auto",
                "colorFill": "auto",
                "alphaStroke": "auto",
                "alphaFillOff": "auto",
                "alphaFillOn": "auto",
                "padding": "auto",
                "css": "",
                "variables": "@{parent.variables}",
                "traversing": false,
                "layout": "horizontal",
                "justify": "start",
                "gridTemplate": "",
                "scroll": true,
                "innerPadding": true,
                "verticalTabs": false,
                "value": "",
                "default": "",
                "linkId": "",
                "script": "",
                "address": "auto",
                "preArgs": "",
                "typeTags": "",
                "decimals": 2,
                "target": "",
                "ignoreDefaults": false,
                "bypass": false,
                "widgets": [
                  {
                    "type": "panel",
                    "top": 20,
                    "left": 40,
                    "id": "band_strip",
                    "visible": true,
                    "interaction": true,
                    "width": "12.5%",
                    "height": "auto",
                    "expand": true,
                    "colorBg": "auto",
                    "colorText": "auto",
                    "colorWidget": "auto",
                    "colorStroke": "auto",
                    "colorFill": "auto",
                    "alphaStroke": "auto",
                    "alphaFillOff": "auto",
                    "alphaFillOn": "auto",
                    "padding": "auto",
                    "css": "",
                    "variables": {
                      "band_no": 1
                    },
                    "traversing": false,
                    "layout": "vertical",
                    "justify": "start",
                    "gridTemplate": "",
                    "scroll": true,
                    "innerPadding": true,
                    "verticalTabs": false,
                    "value": "",
                    "default": "",
                    "linkId": "",
                    "script": "",
                    "address": "auto",
                    "preArgs": "",
                    "typeTags": "",
                    "decimals": 2,
                    "target": "",
                    "ignoreDefaults": false,
                    "bypass": false,
                    "widgets": [
                      {
                        "type": "dropdown",
                        "top": 20,
                        "left": 50,
                        "id": "type_@{parent.variables.band_no}",
                        "visible": true,
                        "interaction": true,
                        "width": "auto",
                        "height": "auto",
                        "expand": "false",
                        "colorText": "auto",
                        "colorWidget": "auto",
                        "colorStroke": "auto",
                        "colorFill": "auto",
                        "alphaStroke": "auto",
                        "alphaFillOff": "auto",
                        "alphaFillOn": "auto",
                        "padding": "auto",
                        "css": "",
                        "value": "",
                        "default": "off",
                        "linkId": "",
                        "script": "",
                        "address": "/eq/type/@{parent.variables.band_no}/value",
                        "preArgs": [],
                        "typeTags": "s",
                        "decimals": 0,
                        "target": [],
                        "ignoreDefaults": false,
                        "bypass": false,
                        "align": "left",
                        "values": {
                          "Off": "off",
                          "Lowshelf": "lowshelf",
                          "Lowcut": "lowcut",
                          "Bell": "bell",
                          "Notch": "notch",
                          "Highcut": "highcut",
                          "Highshelf": "highshelf"
                        },
                        "comments": "",
                        "lineWidth": "auto",
                        "html": "",
                        "label": "auto",
                        "icon": "true"
                      },
                      {
                        "type": "knob",
                        "top": 10,
                        "left": 140,
                        "id": "freq_@{parent.variables.band_no}",
                        "visible": true,
                        "interaction": true,
                        "width": 80,
                        "height": 80,
                        "expand": false,
                        "colorText": "auto",
                        "colorWidget": "auto",
                        "colorStroke": "auto",
                        "colorFill": "auto",
                        "alphaStroke": "auto",
                        "alphaFillOff": "auto",
                        "alphaFillOn": "auto",
                        "padding": "auto",
                        "css": "",
                        "mode": "vertical",
                        "spring": false,
                        "pips": false,
                        "dashed": false,
                        "angle": 270,
                        "doubleTap": true,
                        "range": {
                          "min": 0,
                          "max": 127
                        },
                        "logScale": false,
                        "sensitivity": 1,
                        "steps": "",
                        "origin": 63,
                        "value": "",
                        "default": 63,
                        "linkId": "",
                        "script": "",
                        "address": "/eq/freq/@{parent.variables.band_no}/value",
                        "preArgs": [],
                        "typeTags": "i",
                        "decimals": 0,
                        "target": [],
                        "ignoreDefaults": false,
                        "bypass": false,
                        "comments": "",
                        "lineWidth": "auto",
                        "html": "",
                        "design": "default"
                      },
                      {
                        "type": "panel",
                        "top": 10,
                        "left": 50,
                        "id": "panel_freq_@{parent.variables.band_no}",
                        "visible": true,
                        "interaction": true,
                        "width": "auto",
                        "height": 30,
                        "expand": "false",
                        "colorBg": "auto",
                        "colorText": "auto",
                        "colorWidget": "auto",
                        "colorStroke": "auto",
                        "colorFill": "auto",
                        "alphaStroke": "auto",
                        "alphaFillOff": "auto",
                        "alphaFillOn": "auto",
                        "padding": "auto",
                        "css": "",
                        "variables": "@{parent.variables}",
                        "traversing": false,
                        "layout": "horizontal",
                        "justify": "start",
                        "gridTemplate": "",
                        "scroll": true,
                        "innerPadding": true,
                        "verticalTabs": false,
                        "value": "",
                        "default": "",
                        "linkId": "",
                        "script": "",
                        "address": "auto",
                        "preArgs": "",
                        "typeTags": "",
                        "decimals": 2,
                        "target": "",
                        "ignoreDefaults": false,
                        "bypass": false,
                        "widgets": [
                          {
                            "type": "text",
                            "top": 10,
                            "left": 40,
                            "id": "freq_label_@{parent.variables.band_no}",
                            "visible": true,
                            "width": "30%",
                            "height": "auto",
                            "expand": "false",
                            "colorText": "auto",
                            "colorWidget": "auto",
                            "colorStroke": "auto",
                            "colorFill": "auto",
                            "alphaStroke": "auto",
                            "alphaFillOff": "auto",
                            "alphaFillOn": "auto",
                            "padding": "auto",
                            "css": "",
                            "vertical": false,
                            "wrap": false,
                            "align": "center",
                            "value": "Freq",
                            "default": "",
                            "linkId": "",
                            "script": "",
                            "address": "auto",
                            "preArgs": "",
                            "target": "",
                            "comments": "",
                            "lineWidth": "auto",
                            "html": "",
                            "decimals": 2
                          },
                          {
                            "type": "text",
                            "top": 20,
                            "left": 30,
                            "id": "freq_str_@{parent.variables.band_no}",
                            "visible": true,
                            "width": "70%",
                            "height": 30,
                            "expand": "false",
                            "colorText": "auto",
                            "colorWidget": "auto",
                            "colorStroke": "auto",
                            "colorFill": "auto",
                            "alphaStroke": "auto",
                            "alphaFillOff": "auto",
                            "alphaFillOn": "auto",
                            "padding": "auto",
                            "css": "",
                            "vertical": false,
                            "wrap": false,
                            "align": "center",
                            "value": "",
                            "default": "",
                            "linkId": "",
                            "script": "",
                            "address": "/eq/freq/@{parent.variables.band_no}/valueStr",
                            "preArgs": "",
                            "target": "",
                            "comments": "",
                            "lineWidth": "auto",
                            "html": "",
                            "decimals": 2
                          }
                        ],
                        "tabs": [],
                        "comments": "",
                        "lineWidth": "auto",
                        "html": "",
                        "contain": true
                      },
                      {
                        "type": "knob",
                        "top": 0,
                        "left": 30,
                        "id": "gain_@{parent.variables.band_no}",
                        "visible": true,
                        "interaction": true,
                        "width": 80,
                        "height": 80,
                        "expand": "false",
                        "colorText": "auto",
                        "colorWidget": "auto",
                        "colorStroke": "auto",
                        "colorFill": "auto",
                        "alphaStroke": "auto",
                        "alphaFillOff": "auto",
                        "alphaFillOn": "auto",
                        "padding": "auto",
                        "css": "",
                        "mode": "vertical",
                        "spring": false,
                        "pips": false,
                        "dashed": false,
                        "angle": 270,
                        "doubleTap": true,
                        "range": {
                          "min": 0,
                          "max": 127
                        },
                        "logScale": false,
                        "sensitivity": 1,
                        "steps": "",
                        "origin": 63,
                        "value": "",
                        "default": 63,
                        "linkId": "",
                        "script": "",
                        "address": "/eq/gain/@{parent.variables.band_no}/value",
                        "preArgs": [],
                        "typeTags": "i",
                        "decimals": 0,
                        "target": [],
                        "ignoreDefaults": false,
                        "bypass": false,
                        "comments": "",
                        "lineWidth": "auto",
                        "html": "",
                        "design": "default"
                      },
                      {
                        "type": "panel",
                        "top": 20,
                        "left": 30,
                        "id": "panel_gain_@{parent.variables.band_no}",
                        "visible": true,
                        "interaction": true,
                        "width": "auto",
                        "height": 30,
                        "expand": "false",
                        "colorBg": "auto",
                        "colorText": "auto",
                        "colorWidget": "auto",
                        "colorStroke": "auto",
                        "colorFill": "auto",
                        "alphaStroke": "auto",
                        "alphaFillOff": "auto",
                        "alphaFillOn": "auto",
                        "padding": "auto",
                        "css": "",
                        "variables": "@{parent.variables}",
                        "traversing": false,
                        "layout": "horizontal",
                        "justify": "start",
                        "gridTemplate": "",
                        "scroll": true,
                        "innerPadding": true,
                        "verticalTabs": false,
                        "value": "",
                        "default": "",
                        "linkId": "",
                        "script": "",
                        "address": "auto",
                        "preArgs": "",
                        "typeTags": "",
                        "decimals": 2,
                        "target": "",
                        "ignoreDefaults": false,
                        "bypass": false,
                        "widgets": [
                          {
                            "type": "text",
                            "top": 10,
                            "left": 70,
                            "id": "gain_label_@{parent.variables.band_no}",
                            "visible": true,
                            "width": "30%",
                            "height": "auto",
                            "expand": "false",
                            "colorText": "auto",
                            "colorWidget": "auto",
                            "colorStroke": "auto",
                            "colorFill": "auto",
                            "alphaStroke": "auto",
                            "alphaFillOff": "auto",
                            "alphaFillOn": "auto",
                            "padding": "auto",
                            "css": "",
                            "vertical": false,
                            "wrap": false,
                            "align": "center",
                            "value": "Gain",
                            "default": "",
                            "linkId": "",
                            "script": "",
                            "address": "auto",
                            "preArgs": "",
                            "target": "",
                            "comments": "",
                            "lineWidth": "auto",
                            "html": "",
                            "decimals": 2
                          },
                          {
                            "type": "text",
                            "top": 10,
                            "left": 40,
                            "id": "gain_str_@{parent.variables.band_no}",
                            "visible": true,
                            "width": "70%",
                            "height": 30,
                            "expand": "false",
                            "colorText": "auto",
                            "colorWidget": "auto",
                            "colorStroke": "auto",
                            "colorFill": "auto",
                            "alphaStroke": "auto",
                            "alphaFillOff": "auto",
                            "alphaFillOn": "auto",
                            "padding": "auto",
                            "css": "",
                            "vertical": false,
                            "wrap": false,
                            "align": "center",
                            "value": "",
                            "default": "",
                            "linkId": "",
                            "script": "",
                            "address": "/eq/gain/@{parent.variables.band_no}/valueStr",
                            "preArgs": "",
                            "target": "",
                            "comments": "",
                            "lineWidth": "auto",
                            "html": "",
                            "decimals": 2
                          }
                        ],
                        "tabs": [],
                        "comments": "",
                        "lineWidth": "auto",
                        "html": "",
                        "contain": true
                      },
                      {
                        "type": "knob",
                        "top": 100,
                        "left": 180,
                        "id": "q_@{parent.variables.band_no}",
                        "visible": true,
                        "interaction": true,
                        "width": 80,
                        "height": 80,
                        "expand": "false",
                        "colorText": "auto",
                        "colorWidget": "auto",
                        "colorStroke": "auto",
                        "colorFill": "auto",
                        "alphaStroke": "auto",
                        "alphaFillOff": "auto",
                        "alphaFillOn": "auto",
                        "padding": "auto",
                        "css": "",
                        "mode": "vertical",
                        "spring": false,
                        "pips": false,
                        "dashed": false,
                        "angle": 270,
                        "doubleTap": true,
                        "range": {
                          "min": 127,
                          "max": 0
                        },
                        "logScale": false,
                        "sensitivity": 1,
                        "steps": "",
                        "origin": 63,
                        "value": "",
                        "default": 63,
                        "linkId": "",
                        "script": "",
                        "address": "/eq/q/@{parent.variables.band_no}/value",
                        "preArgs": [],
                        "typeTags": "i",
                        "decimals": 0,
                        "target": [],
                        "ignoreDefaults": false,
                        "bypass": false,
                        "comments": "",
                        "lineWidth": "auto",
                        "html": "",
                        "design": "default"
                      },
                      {
                        "type": "panel",
                        "top": 10,
                        "left": 40,
                        "id": "panel_q_@{parent.variables.band_no}",
                        "visible": true,
                        "interaction": true,
                        "width": "auto",
                        "height": 30,
                        "expand": "false",
                        "colorBg": "auto",
                        "colorText": "auto",
                        "colorWidget": "auto",
                        "colorStroke": "auto",
                        "colorFill": "auto",
                        "alphaStroke": "auto",
                        "alphaFillOff": "auto",
                        "alphaFillOn": "auto",
                        "padding": "auto",
                        "css": "",
                        "variables": "@{parent.variables}",
                        "traversing": false,
                        "layout": "horizontal",
                        "justify": "start",
                        "gridTemplate": "",
                        "scroll": true,
                        "innerPadding": true,
                        "verticalTabs": false,
                        "value": "",
                        "default": "",
                        "linkId": "",
                        "script": "",
                        "address": "auto",
                        "preArgs": "",
                        "typeTags": "",
                        "decimals": 2,
                        "target": "",
                        "ignoreDefaults": false,
                        "bypass": false,
                        "widgets": [
                          {
                            "type": "text",
                            "top": 10,
                            "left": 30,
                            "id": "q_label_@{parent.variables.band_no}",
                            "visible": true,
                            "width": "30%",
                            "height": "auto",
                            "expand": "false",
                            "colorText": "auto",
                            "colorWidget": "auto",
                            "colorStroke": "auto",
                            "colorFill": "auto",
                            "alphaStroke": "auto",
                            "alphaFillOff": "auto",
                            "alphaFillOn": "auto",
                            "padding": "auto",
                            "css": "",
                            "vertical": false,
                            "wrap": false,
                            "align": "center",
                            "value": "Q",
                            "default": "",
                            "linkId": "",
                            "script": "",
                            "address": "auto",
                            "preArgs": "",
                            "target": "",
                            "comments": "",
                            "lineWidth": "auto",
                            "html": "",
                            "decimals": 2
                          },
                          {
                            "type": "text",
                            "top": 10,
                            "left": 30,
                            "id": "q_str_@{parent.variables.band_no}",
                            "visible": true,
                            "width": "70%",
                            "height": 30,
                            "expand": "false",
                            "colorText": "auto",
                            "colorWidget": "auto",
                            "colorStroke": "auto",
                            "colorFill": "auto",
                            "alphaStroke": "auto",
                            "alphaFillOff": "auto",
                            "alphaFillOn": "auto",
                            "padding": "auto",
                            "css": "",
                            "vertical": false,
                            "wrap": false,
                            "align": "center",
                            "value": "",
                            "default": "",
                            "linkId": "",
                            "script": "",
                            "address": "/eq/q/@{parent.variables.band_no}/valueStr",
                            "preArgs": "",
                            "target": "",
                            "comments": "",
                            "lineWidth": "auto",
                            "html": "",
                            "decimals": 2
                          }
                        ],
                        "tabs": [],
                        "comments": "",
                        "lineWidth": "auto",
                        "html": "",
                        "contain": true
                      },
                      {
                        "type": "script",
                        "id": "script_to_gain_@{parent.variables.band_no}",
                        "event": "value",
                        "script": "var gainValue = value[0];\nvar bandNo = value[1];\nvar index = 1 + (bandNo - 1) * 2;\nvar multiValues = get(\"multixy_1\");\nmultiValues[index] = gainValue - 64;\nset(\"multixy_1\", multiValues);",
                        "keyBinding": "",
                        "keyRepeat": true,
                        "keyType": "keydown",
                        "value": "[@{gain_@{parent.variables.band_no}}, @{parent.variables.band_no}]",
                        "default": "",
                        "linkId": "",
                        "address": "auto",
                        "preArgs": "",
                        "typeTags": "",
                        "decimals": 2,
                        "target": "",
                        "ignoreDefaults": false,
                        "bypass": false,
                        "comments": ""
                      },
                      {
                        "type": "script",
                        "id": "script_to_freq_@{parent.variables.band_no}",
                        "event": "value",
                        "script": "var freqValue = value[0];\nvar bandNo = value[1];\nvar index = (bandNo - 1) * 2;\nvar multiValues = get(\"multixy_1\");\nmultiValues[index] = (freqValue / 127.0) * (22000 - 20) + 20;\nset(\"multixy_1\", multiValues);",
                        "keyBinding": "",
                        "keyRepeat": true,
                        "keyType": "keydown",
                        "value": "[@{freq_@{parent.variables.band_no}}, @{parent.variables.band_no}]",
                        "default": "",
                        "linkId": "",
                        "address": "auto",
                        "preArgs": "",
                        "typeTags": "",
                        "decimals": 2,
                        "target": "",
                        "ignoreDefaults": false,
                        "bypass": false,
                        "comments": ""
                      },
                      {
                        "type": "script",
                        "id": "script_update_from_type_@{parent.variables.band_no}",
                        "event": "value",
                        "script": "var qValue = get(\"q_1\");\nset(\"q_1\", qValue + 1);\nset(\"q_1\", qValue);",
                        "keyBinding": "",
                        "keyRepeat": true,
                        "keyType": "keydown",
                        "value": "@{type_@{parent.variables.band_no}}",
                        "default": "",
                        "linkId": "",
                        "address": "auto",
                        "preArgs": "",
                        "typeTags": "",
                        "decimals": 2,
                        "target": "",
                        "ignoreDefaults": false,
                        "bypass": false,
                        "comments": ""
                      }
                    ],
                    "tabs": [],
                    "comments": "",
                    "lineWidth": "auto",
                    "html": "",
                    "contain": true
                  },
                  {
                    "type": "clone",
                    "widgetId": "band_strip",
                    "width": "12.5%",
                    "height": "auto",
                    "left": 80,
                    "top": 10,
                    "id": "clone_band_strip_2",
                    "visible": true,
                    "interaction": true,
                    "expand": "false",
                    "css": "",
                    "props": {
                      "variables": {
                        "band_no": 2
                      },
                      "id": "band_strip_2"
                    },
                    "comments": "",
                    "script": "",
                    "address": "auto",
                    "variables": "@{parent.variables}"
                  },
                  {
                    "type": "clone",
                    "widgetId": "band_strip",
                    "width": "12.5%",
                    "height": "auto",
                    "left": 80,
                    "top": 10,
                    "id": "clone_band_strip_3",
                    "visible": true,
                    "interaction": true,
                    "expand": "false",
                    "css": "",
                    "props": {
                      "variables": {
                        "band_no": 3
                      },
                      "id": "band_strip_3"
                    },
                    "comments": "",
                    "script": "",
                    "address": "auto",
                    "variables": "@{parent.variables}"
                  },
                  {
                    "type": "clone",
                    "widgetId": "band_strip",
                    "width": "12.5%",
                    "height": "auto",
                    "left": 80,
                    "top": 20,
                    "id": "clone_band_strip_4",
                    "visible": true,
                    "interaction": true,
                    "expand": "false",
                    "css": "",
                    "props": {
                      "variables": {
                        "band_no": 4
                      },
                      "id": "band_strip_4"
                    },
                    "comments": "",
                    "script": "",
                    "address": "auto",
                    "variables": "@{parent.variables}"
                  },
                  {
                    "type": "clone",
                    "widgetId": "band_strip",
                    "width": "12.5%",
                    "height": "auto",
                    "left": 442,
                    "top": 10,
                    "id": "clone_band_strip_5",
                    "visible": true,
                    "interaction": true,
                    "expand": "false",
                    "css": "",
                    "props": {
                      "variables": {
                        "band_no": 5
                      },
                      "id": "band_strip_5"
                    },
                    "comments": "",
                    "script": "",
                    "address": "auto",
                    "variables": "@{parent.variables}"
                  },
                  {
                    "type": "clone",
                    "widgetId": "band_strip",
                    "width": "12.5%",
                    "height": "auto",
                    "left": 70,
                    "top": 10,
                    "id": "clone_band_strip_6",
                    "visible": true,
                    "interaction": true,
                    "expand": "false",
                    "css": "",
                    "props": {
                      "variables": {
                        "band_no": 6
                      },
                      "id": "band_strip_6"
                    },
                    "comments": "",
                    "script": "",
                    "address": "auto",
                    "variables": "@{parent.variables}"
                  },
                  {
                    "type": "clone",
                    "widgetId": "band_strip",
                    "width": "12.5%",
                    "height": "auto",
                    "left": 50,
                    "top": 20,
                    "id": "clone_band_strip_7",
                    "visible": true,
                    "interaction": true,
                    "expand": "false",
                    "css": "",
                    "props": {
                      "variables": {
                        "band_no": 7
                      },
                      "id": "band_strip_7"
                    },
                    "comments": "",
                    "script": "",
                    "address": "auto",
                    "variables": "@{parent.variables}"
                  },
                  {
                    "type": "clone",
                    "widgetId": "band_strip",
                    "width": "12.5%",
                    "height": "auto",
                    "left": 70,
                    "top": 10,
                    "id": "clone_band_strip_8",
                    "visible": true,
                    "interaction": true,
                    "expand": "false",
                    "css": "",
                    "props": {
                      "variables": {
                        "band_no": 8
                      },
                      "id": "band_strip_8"
                    },
                    "comments": "",
                    "script": "",
                    "address": "auto",
                    "variables": "@{parent.variables}"
                  }
                ],
                "tabs": [],
                "comments": "",
                "lineWidth": "auto",
                "html": "",
                "contain": true
              },
              {
                "type": "button",
                "top": 10,
                "left": 30,
                "id": "button_add_eq",
                "visible": true,
                "interaction": true,
                "width": "auto",
                "height": "auto",
                "expand": "false",
                "colorText": "auto",
                "colorWidget": "auto",
                "colorStroke": "auto",
                "colorFill": "auto",
                "alphaStroke": "auto",
                "alphaFillOff": "auto",
                "alphaFillOn": "auto",
                "padding": "auto",
                "css": "",
                "label": "Add EQ",
                "on": 1,
                "off": 0,
                "mode": "push",
                "doubleTap": false,
                "colorTextOn": "auto",
                "value": "",
                "default": "",
                "linkId": "",
                "script": "",
                "address": "/eq/add",
                "preArgs": [],
                "typeTags": "i",
                "decimals": 0,
                "target": [],
                "ignoreDefaults": false,
                "bypass": false,
                "comments": "",
                "lineWidth": "auto",
                "html": "",
                "vertical": false,
                "wrap": false
              }
            ],
            "tabs": [],
            "decimals": 2,
            "layout": "vertical",
            "alphaStroke": 0,
            "innerPadding": false,
            "padding": 0,
            "visible": true,
            "interaction": true,
            "expand": false,
            "colorBg": "auto",
            "colorText": "auto",
            "colorWidget": "auto",
            "colorStroke": "auto",
            "colorFill": "auto",
            "alphaFillOff": "auto",
            "alphaFillOn": "auto",
            "traversing": false,
            "justify": "start",
            "gridTemplate": "",
            "verticalTabs": false,
            "script": "",
            "typeTags": "",
            "ignoreDefaults": false,
            "comments": "",
            "lineWidth": "auto",
            "html": "",
            "contain": true
          }
        ],
        "tabs": [],
        "scroll": true,
        "decimals": 2,
        "innerPadding": false,
        "padding": 0,
        "visible": true,
        "interaction": true,
        "colorBg": "auto",
        "colorText": "auto",
        "colorWidget": "auto",
        "colorFill": "auto",
        "traversing": false,
        "layout": "default",
        "justify": "start",
        "gridTemplate": "",
        "verticalTabs": false,
        "script": "",
        "typeTags": "",
        "ignoreDefaults": false,
        "comments": "",
        "html": "",
        "contain": true
      }
    ],
    "scroll": true,
    "decimals": 2,
    "interaction": true,
    "colorBg": "auto",
    "colorText": "auto",
    "colorWidget": "auto",
    "alphaFillOn": "auto",
    "padding": "auto",
    "layout": "default",
    "justify": "start",
    "gridTemplate": "",
    "innerPadding": true,
    "verticalTabs": false,
    "script": "",
    "typeTags": "",
    "ignoreDefaults": false,
    "widgets": [],
    "visible": true,
    "comments": "",
    "width": "auto",
    "height": "auto",
    "html": "",
    "contain": true
  }
}


================================================
FILE: resources/XJam/DrivenByMoss.xjam
================================================
[Binary file]


================================================
FILE: src/assembly/dep.xml
================================================
<assembly xmlns="http://maven.apache.org/plugins/maven-assembly-plugin/assembly/1.1.2" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/plugins/maven-assembly-plugin/assembly/1.1.2 http://maven.apache.org/xsd/assembly-1.1.2.xsd">
    <id>Bitwig</id>
    <includeBaseDirectory>false</includeBaseDirectory>
    <formats>
        <format>zip</format>
    </formats>
    <fileSets>
        <fileSet>
            <directory>${project.basedir}</directory>
            <outputDirectory>/</outputDirectory>
            <includes>
                <include>LICENSE*</include>
                <include>DrivenByMoss-Manual.pdf</include>
            </includes>
        </fileSet>
        <fileSet>
            <directory>${project.basedir}/target/generated-sources/license/</directory>
            <outputDirectory>/</outputDirectory>
            <includes>
                <include>THIRD-PARTY.txt</include>
            </includes>
        </fileSet>
        <fileSet>
            <directory>${bitwig.extension.directory}</directory>
            <outputDirectory></outputDirectory>
            <includes>
                <include>*.bwextension</include>
            </includes>
        </fileSet>
        <fileSet>
            <directory>${project.basedir}/resources</directory>
            <outputDirectory>resources</outputDirectory>
        </fileSet>
    </fileSets>
</assembly>


================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/ableton/push/Push1ControllerExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.ableton.push;

import de.mossgrabers.bitwig.framework.BitwigSetupFactory;
import de.mossgrabers.bitwig.framework.configuration.SettingsUIImpl;
import de.mossgrabers.bitwig.framework.daw.HostImpl;
import de.mossgrabers.bitwig.framework.extension.AbstractControllerExtensionDefinition;
import de.mossgrabers.controller.ableton.push.Push1ControllerDefinition;
import de.mossgrabers.controller.ableton.push.PushConfiguration;
import de.mossgrabers.controller.ableton.push.PushControllerSetup;
import de.mossgrabers.controller.ableton.push.PushVersion;
import de.mossgrabers.controller.ableton.push.controller.PushControlSurface;
import de.mossgrabers.framework.controller.IControllerSetup;

import com.bitwig.extension.controller.api.ControllerHost;


/**
 * Definition class for the Push 1 extension.
 *
 * @author Jürgen Moßgraber
 */
public class Push1ControllerExtensionDefinition extends AbstractControllerExtensionDefinition<PushControlSurface, PushConfiguration>
{
    /**
     * Constructor.
     */
    public Push1ControllerExtensionDefinition ()
    {
        super (new Push1ControllerDefinition ());
    }


    /** {@inheritDoc} */
    @Override
    protected IControllerSetup<PushControlSurface, PushConfiguration> getControllerSetup (final ControllerHost host)
    {
        return new PushControllerSetup (new HostImpl (host), new BitwigSetupFactory (host), new SettingsUIImpl (host, host.getPreferences ()), new SettingsUIImpl (host, host.getDocumentState ()), PushVersion.VERSION_1);
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/ableton/push/Push2ControllerExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.ableton.push;

import de.mossgrabers.bitwig.framework.BitwigSetupFactory;
import de.mossgrabers.bitwig.framework.configuration.SettingsUIImpl;
import de.mossgrabers.bitwig.framework.daw.HostImpl;
import de.mossgrabers.bitwig.framework.extension.AbstractControllerExtensionDefinition;
import de.mossgrabers.controller.ableton.push.Push2ControllerDefinition;
import de.mossgrabers.controller.ableton.push.PushConfiguration;
import de.mossgrabers.controller.ableton.push.PushControllerSetup;
import de.mossgrabers.controller.ableton.push.PushVersion;
import de.mossgrabers.controller.ableton.push.controller.PushControlSurface;
import de.mossgrabers.framework.controller.IControllerSetup;

import com.bitwig.extension.controller.api.ControllerHost;


/**
 * Definition class for the Push 2 controller extension.
 *
 * @author Jürgen Moßgraber
 */
public class Push2ControllerExtensionDefinition extends AbstractControllerExtensionDefinition<PushControlSurface, PushConfiguration>
{
    /**
     * Constructor.
     */
    public Push2ControllerExtensionDefinition ()
    {
        super (new Push2ControllerDefinition ());
    }


    /** {@inheritDoc} */
    @Override
    protected IControllerSetup<PushControlSurface, PushConfiguration> getControllerSetup (final ControllerHost host)
    {
        return new PushControllerSetup (new HostImpl (host), new BitwigSetupFactory (host), new SettingsUIImpl (host, host.getPreferences ()), new SettingsUIImpl (host, host.getDocumentState ()), PushVersion.VERSION_2);
    }


    /** {@inheritDoc} */
    @Override
    public boolean isUsingBetaAPI ()
    {
        return true;
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/ableton/push/Push3ControllerExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.ableton.push;

import de.mossgrabers.bitwig.framework.BitwigSetupFactory;
import de.mossgrabers.bitwig.framework.configuration.SettingsUIImpl;
import de.mossgrabers.bitwig.framework.daw.HostImpl;
import de.mossgrabers.bitwig.framework.extension.AbstractControllerExtensionDefinition;
import de.mossgrabers.controller.ableton.push.Push3ControllerDefinition;
import de.mossgrabers.controller.ableton.push.PushConfiguration;
import de.mossgrabers.controller.ableton.push.PushControllerSetup;
import de.mossgrabers.controller.ableton.push.PushVersion;
import de.mossgrabers.controller.ableton.push.controller.PushControlSurface;
import de.mossgrabers.framework.controller.IControllerSetup;

import com.bitwig.extension.controller.api.ControllerHost;


/**
 * Definition class for the Push 3 controller extension.
 *
 * @author Jürgen Moßgraber
 */
public class Push3ControllerExtensionDefinition extends AbstractControllerExtensionDefinition<PushControlSurface, PushConfiguration>
{
    /**
     * Constructor.
     */
    public Push3ControllerExtensionDefinition ()
    {
        super (new Push3ControllerDefinition ());
    }


    /** {@inheritDoc} */
    @Override
    protected IControllerSetup<PushControlSurface, PushConfiguration> getControllerSetup (final ControllerHost host)
    {
        return new PushControllerSetup (new HostImpl (host), new BitwigSetupFactory (host), new SettingsUIImpl (host, host.getPreferences ()), new SettingsUIImpl (host, host.getDocumentState ()), PushVersion.VERSION_3);
    }


    /** {@inheritDoc} */
    @Override
    public boolean isUsingBetaAPI ()
    {
        return true;
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/akai/acvs/ACVSLiveControllerExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.akai.acvs;

import de.mossgrabers.bitwig.framework.BitwigSetupFactory;
import de.mossgrabers.bitwig.framework.configuration.SettingsUIImpl;
import de.mossgrabers.bitwig.framework.daw.HostImpl;
import de.mossgrabers.bitwig.framework.extension.AbstractControllerExtensionDefinition;
import de.mossgrabers.controller.akai.acvs.ACVSConfiguration;
import de.mossgrabers.controller.akai.acvs.ACVSControllerDefinition;
import de.mossgrabers.controller.akai.acvs.ACVSControllerSetup;
import de.mossgrabers.controller.akai.acvs.controller.ACVSControlSurface;
import de.mossgrabers.framework.controller.IControllerSetup;

import com.bitwig.extension.controller.api.ControllerHost;


/**
 * Definition class for the Akai devices supporting the ACVS protocol. Currently, the MPC Live I,
 * II, One, X and Force.
 *
 * @author Jürgen Moßgraber
 */
public class ACVSLiveControllerExtensionDefinition extends AbstractControllerExtensionDefinition<ACVSControlSurface, ACVSConfiguration>
{
    /**
     * Constructor.
     */
    public ACVSLiveControllerExtensionDefinition ()
    {
        super (new ACVSControllerDefinition ());
    }


    /** {@inheritDoc} */
    @Override
    protected IControllerSetup<ACVSControlSurface, ACVSConfiguration> getControllerSetup (final ControllerHost host)
    {
        return new ACVSControllerSetup (new HostImpl (host), new BitwigSetupFactory (host), new SettingsUIImpl (host, host.getPreferences ()), new SettingsUIImpl (host, host.getDocumentState ()));
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/akai/apc/APCmkIControllerExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.akai.apc;

import de.mossgrabers.bitwig.framework.BitwigSetupFactory;
import de.mossgrabers.bitwig.framework.configuration.SettingsUIImpl;
import de.mossgrabers.bitwig.framework.daw.HostImpl;
import de.mossgrabers.bitwig.framework.extension.AbstractControllerExtensionDefinition;
import de.mossgrabers.controller.akai.apc.APCConfiguration;
import de.mossgrabers.controller.akai.apc.APCControllerDefinition;
import de.mossgrabers.controller.akai.apc.APCControllerSetup;
import de.mossgrabers.controller.akai.apc.controller.APCControlSurface;
import de.mossgrabers.framework.controller.IControllerSetup;

import com.bitwig.extension.controller.api.ControllerHost;


/**
 * Definition class for the APC40 mkI extension.
 *
 * @author Jürgen Moßgraber
 */
public class APCmkIControllerExtensionDefinition extends AbstractControllerExtensionDefinition<APCControlSurface, APCConfiguration>
{
    /**
     * Constructor.
     */
    public APCmkIControllerExtensionDefinition ()
    {
        super (new APCControllerDefinition (false));
    }


    /** {@inheritDoc} */
    @Override
    protected IControllerSetup<APCControlSurface, APCConfiguration> getControllerSetup (final ControllerHost host)
    {
        return new APCControllerSetup (new HostImpl (host), new BitwigSetupFactory (host), new SettingsUIImpl (host, host.getPreferences ()), new SettingsUIImpl (host, host.getDocumentState ()), false);
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/akai/apc/APCmkIIControllerExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.akai.apc;

import de.mossgrabers.bitwig.framework.BitwigSetupFactory;
import de.mossgrabers.bitwig.framework.configuration.SettingsUIImpl;
import de.mossgrabers.bitwig.framework.daw.HostImpl;
import de.mossgrabers.bitwig.framework.extension.AbstractControllerExtensionDefinition;
import de.mossgrabers.controller.akai.apc.APCConfiguration;
import de.mossgrabers.controller.akai.apc.APCControllerDefinition;
import de.mossgrabers.controller.akai.apc.APCControllerSetup;
import de.mossgrabers.controller.akai.apc.controller.APCControlSurface;
import de.mossgrabers.framework.controller.IControllerSetup;

import com.bitwig.extension.controller.api.ControllerHost;


/**
 * Definition class for the APC40 mkII controller extension.
 *
 * @author Jürgen Moßgraber
 */
public class APCmkIIControllerExtensionDefinition extends AbstractControllerExtensionDefinition<APCControlSurface, APCConfiguration>
{
    /**
     * Constructor.
     */
    public APCmkIIControllerExtensionDefinition ()
    {
        super (new APCControllerDefinition (true));
    }


    /** {@inheritDoc} */
    @Override
    protected IControllerSetup<APCControlSurface, APCConfiguration> getControllerSetup (final ControllerHost host)
    {
        return new APCControllerSetup (new HostImpl (host), new BitwigSetupFactory (host), new SettingsUIImpl (host, host.getPreferences ()), new SettingsUIImpl (host, host.getDocumentState ()), true);
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/akai/apcmini/APCminiMk1ControllerExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.akai.apcmini;

import com.bitwig.extension.controller.api.ControllerHost;

import de.mossgrabers.bitwig.framework.BitwigSetupFactory;
import de.mossgrabers.bitwig.framework.configuration.SettingsUIImpl;
import de.mossgrabers.bitwig.framework.daw.HostImpl;
import de.mossgrabers.bitwig.framework.extension.AbstractControllerExtensionDefinition;
import de.mossgrabers.controller.akai.apcmini.APCminiConfiguration;
import de.mossgrabers.controller.akai.apcmini.APCminiControllerSetup;
import de.mossgrabers.controller.akai.apcmini.controller.APCminiControlSurface;
import de.mossgrabers.controller.akai.apcmini.definition.APCminiMk1ControllerDefinition;
import de.mossgrabers.framework.controller.IControllerSetup;


/**
 * Definition class for the Akai APCmini Mk1 controller.
 *
 * @author Jürgen Moßgraber
 */
public class APCminiMk1ControllerExtensionDefinition extends AbstractControllerExtensionDefinition<APCminiControlSurface, APCminiConfiguration>
{
    private static final APCminiMk1ControllerDefinition DEFINITION = new APCminiMk1ControllerDefinition ();


    /**
     * Constructor.
     */
    public APCminiMk1ControllerExtensionDefinition ()
    {
        super (DEFINITION);
    }


    /** {@inheritDoc} */
    @Override
    protected IControllerSetup<APCminiControlSurface, APCminiConfiguration> getControllerSetup (final ControllerHost host)
    {
        return new APCminiControllerSetup (new HostImpl (host), new BitwigSetupFactory (host), new SettingsUIImpl (host, host.getPreferences ()), new SettingsUIImpl (host, host.getDocumentState ()), DEFINITION);
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/akai/apcmini/APCminiMk2ControllerExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.akai.apcmini;

import com.bitwig.extension.controller.api.ControllerHost;

import de.mossgrabers.bitwig.framework.BitwigSetupFactory;
import de.mossgrabers.bitwig.framework.configuration.SettingsUIImpl;
import de.mossgrabers.bitwig.framework.daw.HostImpl;
import de.mossgrabers.bitwig.framework.extension.AbstractControllerExtensionDefinition;
import de.mossgrabers.controller.akai.apcmini.APCminiConfiguration;
import de.mossgrabers.controller.akai.apcmini.APCminiControllerSetup;
import de.mossgrabers.controller.akai.apcmini.controller.APCminiControlSurface;
import de.mossgrabers.controller.akai.apcmini.definition.APCminiMk2ControllerDefinition;
import de.mossgrabers.framework.controller.IControllerSetup;


/**
 * Definition class for the Akai APCmini Mk2 controller.
 *
 * @author Jürgen Moßgraber
 */
public class APCminiMk2ControllerExtensionDefinition extends AbstractControllerExtensionDefinition<APCminiControlSurface, APCminiConfiguration>
{
    private static final APCminiMk2ControllerDefinition DEFINITION = new APCminiMk2ControllerDefinition ();


    /**
     * Constructor.
     */
    public APCminiMk2ControllerExtensionDefinition ()
    {
        super (DEFINITION);
    }


    /** {@inheritDoc} */
    @Override
    protected IControllerSetup<APCminiControlSurface, APCminiConfiguration> getControllerSetup (final ControllerHost host)
    {
        return new APCminiControllerSetup (new HostImpl (host), new BitwigSetupFactory (host), new SettingsUIImpl (host, host.getPreferences ()), new SettingsUIImpl (host, host.getDocumentState ()), DEFINITION);
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/akai/fire/FireControllerExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.akai.fire;

import de.mossgrabers.bitwig.framework.BitwigSetupFactory;
import de.mossgrabers.bitwig.framework.configuration.SettingsUIImpl;
import de.mossgrabers.bitwig.framework.daw.HostImpl;
import de.mossgrabers.bitwig.framework.extension.AbstractControllerExtensionDefinition;
import de.mossgrabers.controller.akai.fire.FireConfiguration;
import de.mossgrabers.controller.akai.fire.FireControllerDefinition;
import de.mossgrabers.controller.akai.fire.FireControllerSetup;
import de.mossgrabers.controller.akai.fire.controller.FireControlSurface;
import de.mossgrabers.framework.controller.IControllerSetup;

import com.bitwig.extension.controller.api.ControllerHost;


/**
 * Definition class for the Akai Fire.
 *
 * @author Jürgen Moßgraber
 */
public class FireControllerExtensionDefinition extends AbstractControllerExtensionDefinition<FireControlSurface, FireConfiguration>
{
    /**
     * Constructor.
     */
    public FireControllerExtensionDefinition ()
    {
        super (new FireControllerDefinition ());
    }


    /** {@inheritDoc} */
    @Override
    protected IControllerSetup<FireControlSurface, FireConfiguration> getControllerSetup (final ControllerHost host)
    {
        return new FireControllerSetup (new HostImpl (host), new BitwigSetupFactory (host), new SettingsUIImpl (host, host.getPreferences ()), new SettingsUIImpl (host, host.getDocumentState ()));
    }


    /** {@inheritDoc} */
    @Override
    public boolean isUsingBetaAPI ()
    {
        return true;
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/arturia/beatstep/BeatstepControllerExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.arturia.beatstep;

import de.mossgrabers.bitwig.framework.BitwigSetupFactory;
import de.mossgrabers.bitwig.framework.configuration.SettingsUIImpl;
import de.mossgrabers.bitwig.framework.daw.HostImpl;
import de.mossgrabers.bitwig.framework.extension.AbstractControllerExtensionDefinition;
import de.mossgrabers.controller.arturia.beatstep.BeatstepConfiguration;
import de.mossgrabers.controller.arturia.beatstep.BeatstepControllerDefinition;
import de.mossgrabers.controller.arturia.beatstep.BeatstepControllerSetup;
import de.mossgrabers.controller.arturia.beatstep.controller.BeatstepControlSurface;
import de.mossgrabers.framework.controller.IControllerSetup;

import com.bitwig.extension.controller.api.ControllerHost;


/**
 * Definition class for the Beatstep controller extension.
 *
 * @author Jürgen Moßgraber
 */
public class BeatstepControllerExtensionDefinition extends AbstractControllerExtensionDefinition<BeatstepControlSurface, BeatstepConfiguration>
{
    /**
     * Constructor.
     */
    public BeatstepControllerExtensionDefinition ()
    {
        super (new BeatstepControllerDefinition ());
    }


    /** {@inheritDoc} */
    @Override
    protected IControllerSetup<BeatstepControlSurface, BeatstepConfiguration> getControllerSetup (final ControllerHost host)
    {
        return new BeatstepControllerSetup (new HostImpl (host), new BitwigSetupFactory (host), new SettingsUIImpl (host, host.getPreferences ()), new SettingsUIImpl (host, host.getDocumentState ()));
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/electra/one/ElectraOneControllerExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.electra.one;

import de.mossgrabers.bitwig.framework.BitwigSetupFactory;
import de.mossgrabers.bitwig.framework.configuration.SettingsUIImpl;
import de.mossgrabers.bitwig.framework.daw.HostImpl;
import de.mossgrabers.bitwig.framework.extension.AbstractControllerExtensionDefinition;
import de.mossgrabers.controller.electra.one.ElectraOneConfiguration;
import de.mossgrabers.controller.electra.one.ElectraOneControllerDefinition;
import de.mossgrabers.controller.electra.one.ElectraOneControllerSetup;
import de.mossgrabers.controller.electra.one.controller.ElectraOneControlSurface;
import de.mossgrabers.framework.controller.IControllerSetup;

import com.bitwig.extension.controller.api.ControllerHost;


/**
 * Definition class for the Electra.One extension.
 *
 * @author Jürgen Moßgraber
 */
public class ElectraOneControllerExtensionDefinition extends AbstractControllerExtensionDefinition<ElectraOneControlSurface, ElectraOneConfiguration>
{
    /**
     * Constructor.
     */
    public ElectraOneControllerExtensionDefinition ()
    {
        super (new ElectraOneControllerDefinition ());
    }


    /** {@inheritDoc} */
    @Override
    protected IControllerSetup<ElectraOneControlSurface, ElectraOneConfiguration> getControllerSetup (final ControllerHost host)
    {
        return new ElectraOneControllerSetup (new HostImpl (host), new BitwigSetupFactory (host), new SettingsUIImpl (host, host.getPreferences ()), new SettingsUIImpl (host, host.getDocumentState ()));
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/esi/xjam/XjamControllerExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.esi.xjam;

import de.mossgrabers.bitwig.framework.BitwigSetupFactory;
import de.mossgrabers.bitwig.framework.configuration.SettingsUIImpl;
import de.mossgrabers.bitwig.framework.daw.HostImpl;
import de.mossgrabers.bitwig.framework.extension.AbstractControllerExtensionDefinition;
import de.mossgrabers.controller.esi.xjam.XjamConfiguration;
import de.mossgrabers.controller.esi.xjam.XjamControllerDefinition;
import de.mossgrabers.controller.esi.xjam.XjamControllerSetup;
import de.mossgrabers.controller.esi.xjam.controller.XjamControlSurface;
import de.mossgrabers.framework.controller.IControllerSetup;

import com.bitwig.extension.controller.api.ControllerHost;


/**
 * Definition class for ESI Xjam controller.
 *
 * @author J&uuml;rgen Mo&szlig;graber
 */
public class XjamControllerExtensionDefinition extends AbstractControllerExtensionDefinition<XjamControlSurface, XjamConfiguration>
{
    /**
     * Constructor.
     */
    public XjamControllerExtensionDefinition ()
    {
        super (new XjamControllerDefinition ());
    }


    /** {@inheritDoc} */
    @Override
    public boolean isUsingBetaAPI ()
    {
        return false;
    }


    /** {@inheritDoc} */
    @Override
    protected IControllerSetup<XjamControlSurface, XjamConfiguration> getControllerSetup (final ControllerHost host)
    {
        return new XjamControllerSetup (new HostImpl (host), new BitwigSetupFactory (host), new SettingsUIImpl (host, host.getPreferences ()), new SettingsUIImpl (host, host.getDocumentState ()));
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/faderfox/ec4/EC4ControllerExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.faderfox.ec4;

import de.mossgrabers.bitwig.framework.BitwigSetupFactory;
import de.mossgrabers.bitwig.framework.configuration.SettingsUIImpl;
import de.mossgrabers.bitwig.framework.daw.HostImpl;
import de.mossgrabers.bitwig.framework.extension.AbstractControllerExtensionDefinition;
import de.mossgrabers.controller.faderfox.ec4.EC4Configuration;
import de.mossgrabers.controller.faderfox.ec4.EC4ControllerDefinition;
import de.mossgrabers.controller.faderfox.ec4.EC4ControllerSetup;
import de.mossgrabers.controller.faderfox.ec4.controller.EC4ControlSurface;
import de.mossgrabers.framework.controller.IControllerSetup;

import com.bitwig.extension.controller.api.ControllerHost;


/**
 * Definition class for Faderfox EC4 controller.
 *
 * @author J&uuml;rgen Mo&szlig;graber
 */
public class EC4ControllerExtensionDefinition extends AbstractControllerExtensionDefinition<EC4ControlSurface, EC4Configuration>
{
    /**
     * Constructor.
     */
    public EC4ControllerExtensionDefinition ()
    {
        super (new EC4ControllerDefinition ());
    }


    /** {@inheritDoc} */
    @Override
    public boolean isUsingBetaAPI ()
    {
        return false;
    }


    /** {@inheritDoc} */
    @Override
    protected IControllerSetup<EC4ControlSurface, EC4Configuration> getControllerSetup (final ControllerHost host)
    {
        return new EC4ControllerSetup (new HostImpl (host), new BitwigSetupFactory (host), new SettingsUIImpl (host, host.getPreferences ()), new SettingsUIImpl (host, host.getDocumentState ()));
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/gamepad/GamepadControllerExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.gamepad;

import de.mossgrabers.bitwig.framework.BitwigSetupFactory;
import de.mossgrabers.bitwig.framework.configuration.SettingsUIImpl;
import de.mossgrabers.bitwig.framework.daw.HostImpl;
import de.mossgrabers.bitwig.framework.extension.AbstractControllerExtensionDefinition;
import de.mossgrabers.controller.gamepad.GamepadConfiguration;
import de.mossgrabers.controller.gamepad.GamepadControllerDefinition;
import de.mossgrabers.controller.gamepad.GamepadControllerSetup;
import de.mossgrabers.controller.gamepad.controller.GamepadControlSurface;
import de.mossgrabers.framework.controller.IControllerSetup;

import com.bitwig.extension.controller.api.ControllerHost;


/**
 * Definition class for the Gamepad controller.
 *
 * @author Jürgen Moßgraber
 */
public class GamepadControllerExtensionDefinition extends AbstractControllerExtensionDefinition<GamepadControlSurface, GamepadConfiguration>
{
    /**
     * Constructor.
     */
    public GamepadControllerExtensionDefinition ()
    {
        super (new GamepadControllerDefinition ());
    }


    /** {@inheritDoc} */
    @Override
    protected IControllerSetup<GamepadControlSurface, GamepadConfiguration> getControllerSetup (final ControllerHost host)
    {
        return new GamepadControllerSetup (new HostImpl (host), new BitwigSetupFactory (host), new SettingsUIImpl (host, host.getPreferences ()), new SettingsUIImpl (host, host.getDocumentState ()));
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/generic/GenericFlexiControllerExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.generic;

import de.mossgrabers.bitwig.framework.BitwigSetupFactory;
import de.mossgrabers.bitwig.framework.configuration.SettingsUIImpl;
import de.mossgrabers.bitwig.framework.daw.HostImpl;
import de.mossgrabers.bitwig.framework.extension.AbstractControllerExtensionDefinition;
import de.mossgrabers.controller.generic.GenericFlexiConfiguration;
import de.mossgrabers.controller.generic.GenericFlexiControllerDefinition;
import de.mossgrabers.controller.generic.GenericFlexiControllerSetup;
import de.mossgrabers.controller.generic.controller.GenericFlexiControlSurface;
import de.mossgrabers.framework.controller.IControllerSetup;

import com.bitwig.extension.controller.api.ControllerHost;


/**
 * Definition class for the Generic Flexi controller.
 *
 * @author Jürgen Moßgraber
 */
public class GenericFlexiControllerExtensionDefinition extends AbstractControllerExtensionDefinition<GenericFlexiControlSurface, GenericFlexiConfiguration>
{
    /**
     * Constructor.
     */
    public GenericFlexiControllerExtensionDefinition ()
    {
        super (new GenericFlexiControllerDefinition ());
    }


    /** {@inheritDoc} */
    @Override
    protected IControllerSetup<GenericFlexiControlSurface, GenericFlexiConfiguration> getControllerSetup (final ControllerHost host)
    {
        return new GenericFlexiControllerSetup (new HostImpl (host), new BitwigSetupFactory (host), new SettingsUIImpl (host, host.getPreferences ()), new SettingsUIImpl (host, host.getDocumentState ()));
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/intuitiveinstruments/ExquisControllerExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.intuitiveinstruments;

import com.bitwig.extension.controller.api.ControllerHost;

import de.mossgrabers.bitwig.framework.BitwigSetupFactory;
import de.mossgrabers.bitwig.framework.configuration.SettingsUIImpl;
import de.mossgrabers.bitwig.framework.daw.HostImpl;
import de.mossgrabers.bitwig.framework.extension.AbstractControllerExtensionDefinition;
import de.mossgrabers.controller.intuitiveinstruments.exquis.ExquisConfiguration;
import de.mossgrabers.controller.intuitiveinstruments.exquis.ExquisControllerDefinition;
import de.mossgrabers.controller.intuitiveinstruments.exquis.ExquisControllerSetup;
import de.mossgrabers.controller.intuitiveinstruments.exquis.controller.ExquisControlSurface;
import de.mossgrabers.framework.controller.IControllerSetup;


/**
 * Definition class for the Intuitive Instruments Exquis controller extension.
 *
 * @author Jürgen Moßgraber
 */
public class ExquisControllerExtensionDefinition extends AbstractControllerExtensionDefinition<ExquisControlSurface, ExquisConfiguration>
{
    /**
     * Constructor.
     */
    public ExquisControllerExtensionDefinition ()
    {
        super (new ExquisControllerDefinition ());
    }


    /** {@inheritDoc} */
    @Override
    protected IControllerSetup<ExquisControlSurface, ExquisConfiguration> getControllerSetup (final ControllerHost host)
    {
        return new ExquisControllerSetup (new HostImpl (host), new BitwigSetupFactory (host), new SettingsUIImpl (host, host.getPreferences ()), new SettingsUIImpl (host, host.getDocumentState ()));
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/mackie/hui/HUIController0ExtenderExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.mackie.hui;

/**
 * Definition class for the Mackie HUI protocol with no extender device.
 *
 * @author Jürgen Moßgraber
 */
public class HUIController0ExtenderExtensionDefinition extends HUIControllerExtensionDefinition
{
    /**
     * Constructor.
     */
    public HUIController0ExtenderExtensionDefinition ()
    {
        super (0);
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/mackie/hui/HUIController1ExtenderExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.mackie.hui;

/**
 * Definition class for the Mackie HUI protocol with 1 extender device.
 *
 * @author Jürgen Moßgraber
 */
public class HUIController1ExtenderExtensionDefinition extends HUIControllerExtensionDefinition
{
    /**
     * Constructor.
     */
    public HUIController1ExtenderExtensionDefinition ()
    {
        super (1);
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/mackie/hui/HUIController2ExtenderExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.mackie.hui;

/**
 * Definition class for the Mackie HUI protocol with 2 extender devices.
 *
 * @author Jürgen Moßgraber
 */
public class HUIController2ExtenderExtensionDefinition extends HUIControllerExtensionDefinition
{
    /**
     * Constructor.
     */
    public HUIController2ExtenderExtensionDefinition ()
    {
        super (2);
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/mackie/hui/HUIControllerExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.mackie.hui;

import de.mossgrabers.bitwig.framework.BitwigSetupFactory;
import de.mossgrabers.bitwig.framework.configuration.SettingsUIImpl;
import de.mossgrabers.bitwig.framework.daw.HostImpl;
import de.mossgrabers.bitwig.framework.extension.AbstractControllerExtensionDefinition;
import de.mossgrabers.controller.mackie.hui.HUIConfiguration;
import de.mossgrabers.controller.mackie.hui.HUIControllerDefinition;
import de.mossgrabers.controller.mackie.hui.HUIControllerSetup;
import de.mossgrabers.controller.mackie.hui.controller.HUIControlSurface;
import de.mossgrabers.framework.controller.IControllerSetup;

import com.bitwig.extension.controller.api.ControllerHost;


/**
 * Definition class for the Mackie MCU protocol.
 *
 * @author Jürgen Moßgraber
 */
public class HUIControllerExtensionDefinition extends AbstractControllerExtensionDefinition<HUIControlSurface, HUIConfiguration>
{
    private final int numHUIDevices;


    /**
     * Constructor.
     *
     * @param numHUIExtenders The number of supported extenders
     */
    HUIControllerExtensionDefinition (final int numHUIExtenders)
    {
        super (new HUIControllerDefinition (numHUIExtenders));
        this.numHUIDevices = numHUIExtenders + 1;
    }


    /** {@inheritDoc} */
    @Override
    protected IControllerSetup<HUIControlSurface, HUIConfiguration> getControllerSetup (final ControllerHost host)
    {
        return new HUIControllerSetup (new HostImpl (host), new BitwigSetupFactory (host), new SettingsUIImpl (host, host.getPreferences ()), new SettingsUIImpl (host, host.getDocumentState ()), this.numHUIDevices);
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/mackie/mcu/MCUController0ExtenderExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.mackie.mcu;

/**
 * Definition class for the Mackie MCU protocol.
 *
 * @author Jürgen Moßgraber
 */
public class MCUController0ExtenderExtensionDefinition extends MCUControllerExtensionDefinition
{
    /**
     * Constructor.
     */
    public MCUController0ExtenderExtensionDefinition ()
    {
        super (0);
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/mackie/mcu/MCUController1ExtenderExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.mackie.mcu;

/**
 * Definition class for the Mackie MCU protocol with 1 extender device.
 *
 * @author Jürgen Moßgraber
 */
public class MCUController1ExtenderExtensionDefinition extends MCUControllerExtensionDefinition
{
    /**
     * Constructor.
     */
    public MCUController1ExtenderExtensionDefinition ()
    {
        super (1);
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/mackie/mcu/MCUController2ExtenderExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.mackie.mcu;

/**
 * Definition class for the Mackie MCU protocol with 2 extender devices.
 *
 * @author Jürgen Moßgraber
 */
public class MCUController2ExtenderExtensionDefinition extends MCUControllerExtensionDefinition
{
    /**
     * Constructor.
     */
    public MCUController2ExtenderExtensionDefinition ()
    {
        super (2);
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/mackie/mcu/MCUController3ExtenderExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.mackie.mcu;

/**
 * Definition class for the Mackie MCU protocol with 3 extender devices.
 *
 * @author Jürgen Moßgraber
 */
public class MCUController3ExtenderExtensionDefinition extends MCUControllerExtensionDefinition
{
    /**
     * Constructor.
     */
    public MCUController3ExtenderExtensionDefinition ()
    {
        super (3);
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/mackie/mcu/MCUControllerExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.mackie.mcu;

import de.mossgrabers.bitwig.framework.BitwigSetupFactory;
import de.mossgrabers.bitwig.framework.configuration.SettingsUIImpl;
import de.mossgrabers.bitwig.framework.daw.HostImpl;
import de.mossgrabers.bitwig.framework.extension.AbstractControllerExtensionDefinition;
import de.mossgrabers.controller.mackie.mcu.MCUConfiguration;
import de.mossgrabers.controller.mackie.mcu.MCUControllerDefinition;
import de.mossgrabers.controller.mackie.mcu.MCUControllerSetup;
import de.mossgrabers.controller.mackie.mcu.controller.MCUControlSurface;
import de.mossgrabers.framework.controller.IControllerSetup;

import com.bitwig.extension.controller.api.ControllerHost;


/**
 * Definition class for the Mackie MCU protocol.
 *
 * @author Jürgen Moßgraber
 */
abstract class MCUControllerExtensionDefinition extends AbstractControllerExtensionDefinition<MCUControlSurface, MCUConfiguration>
{
    private final int numMCUDevices;


    /**
     * Constructor.
     *
     * @param numMCUExtenders The number of supported extenders
     */
    MCUControllerExtensionDefinition (final int numMCUExtenders)
    {
        super (new MCUControllerDefinition (numMCUExtenders));
        this.numMCUDevices = numMCUExtenders + 1;
    }


    /** {@inheritDoc} */
    @Override
    protected IControllerSetup<MCUControlSurface, MCUConfiguration> getControllerSetup (final ControllerHost host)
    {
        return new MCUControllerSetup (new HostImpl (host), new BitwigSetupFactory (host), new SettingsUIImpl (host, host.getPreferences ()), new SettingsUIImpl (host, host.getDocumentState ()), this.numMCUDevices);
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/ni/kontrol/mki/AbstractKontrol1ExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.ni.kontrol.mki;

import de.mossgrabers.bitwig.framework.BitwigSetupFactory;
import de.mossgrabers.bitwig.framework.configuration.SettingsUIImpl;
import de.mossgrabers.bitwig.framework.daw.HostImpl;
import de.mossgrabers.bitwig.framework.extension.AbstractControllerExtensionDefinition;
import de.mossgrabers.controller.ni.kontrol.mki.Kontrol1Configuration;
import de.mossgrabers.controller.ni.kontrol.mki.Kontrol1ControllerDefinition;
import de.mossgrabers.controller.ni.kontrol.mki.Kontrol1ControllerSetup;
import de.mossgrabers.controller.ni.kontrol.mki.controller.Kontrol1ControlSurface;
import de.mossgrabers.framework.controller.IControllerSetup;

import com.bitwig.extension.controller.api.ControllerHost;


/**
 * Definition class for Native Instruments Komplete Kontrol 1 S-series controllers.
 *
 * @author Jürgen Moßgraber
 */
public abstract class AbstractKontrol1ExtensionDefinition extends AbstractControllerExtensionDefinition<Kontrol1ControlSurface, Kontrol1Configuration>
{
    private final int modelIndex;


    /**
     * Constructor.
     *
     * @param modelIndex The index of the specific model
     */
    protected AbstractKontrol1ExtensionDefinition (final int modelIndex)
    {
        super (new Kontrol1ControllerDefinition (modelIndex));
        this.modelIndex = modelIndex;
    }


    /** {@inheritDoc} */
    @Override
    public boolean isUsingBetaAPI ()
    {
        return true;
    }


    /** {@inheritDoc} */
    @Override
    protected IControllerSetup<Kontrol1ControlSurface, Kontrol1Configuration> getControllerSetup (final ControllerHost host)
    {
        return new Kontrol1ControllerSetup (this.modelIndex, new HostImpl (host), new BitwigSetupFactory (host), new SettingsUIImpl (host, host.getPreferences ()), new SettingsUIImpl (host, host.getDocumentState ()));
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/ni/kontrol/mki/Kontrol1S25ExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.ni.kontrol.mki;

/**
 * Definition class for Native Instruments Komplete Kontrol 1 S25 controller.
 *
 * @author Jürgen Moßgraber
 */
public class Kontrol1S25ExtensionDefinition extends AbstractKontrol1ExtensionDefinition
{
    /**
     * Constructor.
     */
    public Kontrol1S25ExtensionDefinition ()
    {
        super (0);
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/ni/kontrol/mki/Kontrol1S49ExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.ni.kontrol.mki;

/**
 * Definition class for Native Instruments Komplete Kontrol 1 S49 controller.
 *
 * @author Jürgen Moßgraber
 */
public class Kontrol1S49ExtensionDefinition extends AbstractKontrol1ExtensionDefinition
{
    /**
     * Constructor.
     */
    public Kontrol1S49ExtensionDefinition ()
    {
        super (1);
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/ni/kontrol/mki/Kontrol1S61ExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.ni.kontrol.mki;

/**
 * Definition class for Native Instruments Komplete Kontrol 1 S61 controller.
 *
 * @author Jürgen Moßgraber
 */
public class Kontrol1S61ExtensionDefinition extends AbstractKontrol1ExtensionDefinition
{
    /**
     * Constructor.
     */
    public Kontrol1S61ExtensionDefinition ()
    {
        super (2);
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/ni/kontrol/mki/Kontrol1S88ExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.ni.kontrol.mki;

/**
 * Definition class for Native Instruments Komplete Kontrol 1 S88 controller.
 *
 * @author Jürgen Moßgraber
 */
public class Kontrol1S88ExtensionDefinition extends AbstractKontrol1ExtensionDefinition
{
    /**
     * Constructor.
     */
    public Kontrol1S88ExtensionDefinition ()
    {
        super (3);
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/ni/kontrol/mkii/KontrolProtocolV1ExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.ni.kontrol.mkii;

import de.mossgrabers.bitwig.framework.BitwigSetupFactory;
import de.mossgrabers.bitwig.framework.configuration.SettingsUIImpl;
import de.mossgrabers.bitwig.framework.daw.HostImpl;
import de.mossgrabers.bitwig.framework.extension.AbstractControllerExtensionDefinition;
import de.mossgrabers.controller.ni.kontrol.mkii.KontrolProtocolConfiguration;
import de.mossgrabers.controller.ni.kontrol.mkii.KontrolProtocolControllerDefinition;
import de.mossgrabers.controller.ni.kontrol.mkii.KontrolProtocolControllerSetup;
import de.mossgrabers.controller.ni.kontrol.mkii.controller.KontrolProtocol;
import de.mossgrabers.controller.ni.kontrol.mkii.controller.KontrolProtocolControlSurface;
import de.mossgrabers.controller.ni.kontrol.mkii.controller.KontrolProtocolDeviceDescriptorV1;
import de.mossgrabers.framework.controller.IControllerSetup;

import com.bitwig.extension.controller.api.ControllerHost;


/**
 * Extension definition class for devices supporting the Komplete Kontrol MIDI protocol version 1.
 *
 * @author Jürgen Moßgraber
 */
public class KontrolProtocolV1ExtensionDefinition extends AbstractControllerExtensionDefinition<KontrolProtocolControlSurface, KontrolProtocolConfiguration>
{
    /**
     * Constructor.
     */
    public KontrolProtocolV1ExtensionDefinition ()
    {
        super (new KontrolProtocolControllerDefinition (new KontrolProtocolDeviceDescriptorV1 ()));
    }


    /** {@inheritDoc} */
    @Override
    protected IControllerSetup<KontrolProtocolControlSurface, KontrolProtocolConfiguration> getControllerSetup (final ControllerHost host)
    {
        return new KontrolProtocolControllerSetup (new HostImpl (host), new BitwigSetupFactory (host), new SettingsUIImpl (host, host.getPreferences ()), new SettingsUIImpl (host, host.getDocumentState ()), KontrolProtocol.VERSION_1);
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/ni/kontrol/mkii/KontrolProtocolV2ExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.ni.kontrol.mkii;

import de.mossgrabers.bitwig.framework.BitwigSetupFactory;
import de.mossgrabers.bitwig.framework.configuration.SettingsUIImpl;
import de.mossgrabers.bitwig.framework.daw.HostImpl;
import de.mossgrabers.bitwig.framework.extension.AbstractControllerExtensionDefinition;
import de.mossgrabers.controller.ni.kontrol.mkii.KontrolProtocolConfiguration;
import de.mossgrabers.controller.ni.kontrol.mkii.KontrolProtocolControllerDefinition;
import de.mossgrabers.controller.ni.kontrol.mkii.KontrolProtocolControllerSetup;
import de.mossgrabers.controller.ni.kontrol.mkii.controller.KontrolProtocol;
import de.mossgrabers.controller.ni.kontrol.mkii.controller.KontrolProtocolControlSurface;
import de.mossgrabers.controller.ni.kontrol.mkii.controller.KontrolProtocolDeviceDescriptorV2;
import de.mossgrabers.framework.controller.IControllerSetup;

import com.bitwig.extension.controller.api.ControllerHost;


/**
 * Extension definition class for devices supporting the Komplete Kontrol MIDI protocol version 2.
 *
 * @author Jürgen Moßgraber
 */
public class KontrolProtocolV2ExtensionDefinition extends AbstractControllerExtensionDefinition<KontrolProtocolControlSurface, KontrolProtocolConfiguration>
{
    /**
     * Constructor.
     */
    public KontrolProtocolV2ExtensionDefinition ()
    {
        super (new KontrolProtocolControllerDefinition (new KontrolProtocolDeviceDescriptorV2 ()));
    }


    /** {@inheritDoc} */
    @Override
    protected IControllerSetup<KontrolProtocolControlSurface, KontrolProtocolConfiguration> getControllerSetup (final ControllerHost host)
    {
        return new KontrolProtocolControllerSetup (new HostImpl (host), new BitwigSetupFactory (host), new SettingsUIImpl (host, host.getPreferences ()), new SettingsUIImpl (host, host.getDocumentState ()), KontrolProtocol.VERSION_2);
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/ni/kontrol/mkii/KontrolProtocolV3ExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.ni.kontrol.mkii;

import com.bitwig.extension.controller.api.ControllerHost;

import de.mossgrabers.bitwig.framework.BitwigSetupFactory;
import de.mossgrabers.bitwig.framework.configuration.SettingsUIImpl;
import de.mossgrabers.bitwig.framework.daw.HostImpl;
import de.mossgrabers.bitwig.framework.extension.AbstractControllerExtensionDefinition;
import de.mossgrabers.controller.ni.kontrol.mkii.KontrolProtocolConfiguration;
import de.mossgrabers.controller.ni.kontrol.mkii.KontrolProtocolControllerDefinition;
import de.mossgrabers.controller.ni.kontrol.mkii.KontrolProtocolControllerSetup;
import de.mossgrabers.controller.ni.kontrol.mkii.controller.KontrolProtocol;
import de.mossgrabers.controller.ni.kontrol.mkii.controller.KontrolProtocolControlSurface;
import de.mossgrabers.controller.ni.kontrol.mkii.controller.KontrolProtocolDeviceDescriptorV3;
import de.mossgrabers.framework.controller.IControllerSetup;


/**
 * Extension definition class for devices supporting the Komplete Kontrol MIDI protocol version 3.
 *
 * @author Jürgen Moßgraber
 */
public class KontrolProtocolV3ExtensionDefinition extends AbstractControllerExtensionDefinition<KontrolProtocolControlSurface, KontrolProtocolConfiguration>
{
    /**
     * Constructor.
     */
    public KontrolProtocolV3ExtensionDefinition ()
    {
        super (new KontrolProtocolControllerDefinition (new KontrolProtocolDeviceDescriptorV3 ()));
    }


    /** {@inheritDoc} */
    @Override
    protected IControllerSetup<KontrolProtocolControlSurface, KontrolProtocolConfiguration> getControllerSetup (final ControllerHost host)
    {
        return new KontrolProtocolControllerSetup (new HostImpl (host), new BitwigSetupFactory (host), new SettingsUIImpl (host, host.getPreferences ()), new SettingsUIImpl (host, host.getDocumentState ()), KontrolProtocol.VERSION_4);
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/ni/maschine/jam/MaschineJamExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.ni.maschine.jam;

import de.mossgrabers.bitwig.framework.BitwigSetupFactory;
import de.mossgrabers.bitwig.framework.configuration.SettingsUIImpl;
import de.mossgrabers.bitwig.framework.daw.HostImpl;
import de.mossgrabers.bitwig.framework.extension.AbstractControllerExtensionDefinition;
import de.mossgrabers.controller.ni.maschine.jam.MaschineJamConfiguration;
import de.mossgrabers.controller.ni.maschine.jam.MaschineJamControllerDefinition;
import de.mossgrabers.controller.ni.maschine.jam.MaschineJamControllerSetup;
import de.mossgrabers.controller.ni.maschine.jam.controller.MaschineJamControlSurface;
import de.mossgrabers.framework.controller.IControllerSetup;

import com.bitwig.extension.controller.api.ControllerHost;


/**
 * Definition class for the NI Maschine Jam controller.
 *
 * @author Jürgen Moßgraber
 */
public class MaschineJamExtensionDefinition extends AbstractControllerExtensionDefinition<MaschineJamControlSurface, MaschineJamConfiguration>
{
    /**
     * Constructor.
     */
    public MaschineJamExtensionDefinition ()
    {
        super (new MaschineJamControllerDefinition ());
    }


    /** {@inheritDoc} */
    @Override
    protected IControllerSetup<MaschineJamControlSurface, MaschineJamConfiguration> getControllerSetup (final ControllerHost host)
    {
        return new MaschineJamControllerSetup (new HostImpl (host), new BitwigSetupFactory (host), new SettingsUIImpl (host, host.getPreferences ()), new SettingsUIImpl (host, host.getDocumentState ()));
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/ni/maschine/mk3/MaschineMikroMk3ExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.ni.maschine.mk3;

import de.mossgrabers.bitwig.framework.BitwigSetupFactory;
import de.mossgrabers.bitwig.framework.configuration.SettingsUIImpl;
import de.mossgrabers.bitwig.framework.daw.HostImpl;
import de.mossgrabers.bitwig.framework.extension.AbstractControllerExtensionDefinition;
import de.mossgrabers.controller.ni.maschine.Maschine;
import de.mossgrabers.controller.ni.maschine.mk3.MaschineConfiguration;
import de.mossgrabers.controller.ni.maschine.mk3.MaschineControllerSetup;
import de.mossgrabers.controller.ni.maschine.mk3.MaschineMikroMk3ControllerDefinition;
import de.mossgrabers.controller.ni.maschine.mk3.controller.MaschineControlSurface;
import de.mossgrabers.framework.controller.IControllerSetup;

import com.bitwig.extension.controller.api.ControllerHost;


/**
 * Definition class for the NI Maschine Mikro Mk3 controller.
 *
 * @author Jürgen Moßgraber
 */
public class MaschineMikroMk3ExtensionDefinition extends AbstractControllerExtensionDefinition<MaschineControlSurface, MaschineConfiguration>
{
    /**
     * Constructor.
     */
    public MaschineMikroMk3ExtensionDefinition ()
    {
        super (new MaschineMikroMk3ControllerDefinition ());
    }


    /** {@inheritDoc} */
    @Override
    protected IControllerSetup<MaschineControlSurface, MaschineConfiguration> getControllerSetup (final ControllerHost host)
    {
        return new MaschineControllerSetup (new HostImpl (host), new BitwigSetupFactory (host), new SettingsUIImpl (host, host.getPreferences ()), new SettingsUIImpl (host, host.getDocumentState ()), Maschine.MIKRO_MK3);
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/ni/maschine/mk3/MaschineMk2ExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.ni.maschine.mk3;

import de.mossgrabers.bitwig.framework.BitwigSetupFactory;
import de.mossgrabers.bitwig.framework.configuration.SettingsUIImpl;
import de.mossgrabers.bitwig.framework.daw.HostImpl;
import de.mossgrabers.bitwig.framework.extension.AbstractControllerExtensionDefinition;
import de.mossgrabers.controller.ni.maschine.Maschine;
import de.mossgrabers.controller.ni.maschine.mk3.MaschineConfiguration;
import de.mossgrabers.controller.ni.maschine.mk3.MaschineControllerSetup;
import de.mossgrabers.controller.ni.maschine.mk3.MaschineMk2ControllerDefinition;
import de.mossgrabers.controller.ni.maschine.mk3.controller.MaschineControlSurface;
import de.mossgrabers.framework.controller.IControllerSetup;

import com.bitwig.extension.controller.api.ControllerHost;


/**
 * Definition class for the NI Maschine Mk2 controller.
 *
 * @author Jürgen Moßgraber
 */
public class MaschineMk2ExtensionDefinition extends AbstractControllerExtensionDefinition<MaschineControlSurface, MaschineConfiguration>
{
    /**
     * Constructor.
     */
    public MaschineMk2ExtensionDefinition ()
    {
        super (new MaschineMk2ControllerDefinition ());
    }


    /** {@inheritDoc} */
    @Override
    protected IControllerSetup<MaschineControlSurface, MaschineConfiguration> getControllerSetup (final ControllerHost host)
    {
        return new MaschineControllerSetup (new HostImpl (host), new BitwigSetupFactory (host), new SettingsUIImpl (host, host.getPreferences ()), new SettingsUIImpl (host, host.getDocumentState ()), Maschine.MK2);
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/ni/maschine/mk3/MaschineMk3ExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.ni.maschine.mk3;

import de.mossgrabers.bitwig.framework.BitwigSetupFactory;
import de.mossgrabers.bitwig.framework.configuration.SettingsUIImpl;
import de.mossgrabers.bitwig.framework.daw.HostImpl;
import de.mossgrabers.bitwig.framework.extension.AbstractControllerExtensionDefinition;
import de.mossgrabers.controller.ni.maschine.Maschine;
import de.mossgrabers.controller.ni.maschine.mk3.MaschineConfiguration;
import de.mossgrabers.controller.ni.maschine.mk3.MaschineControllerSetup;
import de.mossgrabers.controller.ni.maschine.mk3.MaschineMk3ControllerDefinition;
import de.mossgrabers.controller.ni.maschine.mk3.controller.MaschineControlSurface;
import de.mossgrabers.framework.controller.IControllerSetup;

import com.bitwig.extension.controller.api.ControllerHost;


/**
 * Definition class for the NI Maschine Mk3 controller.
 *
 * @author Jürgen Moßgraber
 */
public class MaschineMk3ExtensionDefinition extends AbstractControllerExtensionDefinition<MaschineControlSurface, MaschineConfiguration>
{
    /**
     * Constructor.
     */
    public MaschineMk3ExtensionDefinition ()
    {
        super (new MaschineMk3ControllerDefinition ());
    }


    /** {@inheritDoc} */
    @Override
    protected IControllerSetup<MaschineControlSurface, MaschineConfiguration> getControllerSetup (final ControllerHost host)
    {
        return new MaschineControllerSetup (new HostImpl (host), new BitwigSetupFactory (host), new SettingsUIImpl (host, host.getPreferences ()), new SettingsUIImpl (host, host.getDocumentState ()), Maschine.MK3);
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/ni/maschine/mk3/MaschinePlusExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.ni.maschine.mk3;

import de.mossgrabers.bitwig.framework.BitwigSetupFactory;
import de.mossgrabers.bitwig.framework.configuration.SettingsUIImpl;
import de.mossgrabers.bitwig.framework.daw.HostImpl;
import de.mossgrabers.bitwig.framework.extension.AbstractControllerExtensionDefinition;
import de.mossgrabers.controller.ni.maschine.Maschine;
import de.mossgrabers.controller.ni.maschine.mk3.MaschineConfiguration;
import de.mossgrabers.controller.ni.maschine.mk3.MaschineControllerSetup;
import de.mossgrabers.controller.ni.maschine.mk3.MaschinePlusControllerDefinition;
import de.mossgrabers.controller.ni.maschine.mk3.controller.MaschineControlSurface;
import de.mossgrabers.framework.controller.IControllerSetup;

import com.bitwig.extension.controller.api.ControllerHost;


/**
 * Definition class for the NI Maschine Plus controller.
 *
 * @author Jürgen Moßgraber
 */
public class MaschinePlusExtensionDefinition extends AbstractControllerExtensionDefinition<MaschineControlSurface, MaschineConfiguration>
{
    /**
     * Constructor.
     */
    public MaschinePlusExtensionDefinition ()
    {
        super (new MaschinePlusControllerDefinition ());
    }


    /** {@inheritDoc} */
    @Override
    protected IControllerSetup<MaschineControlSurface, MaschineConfiguration> getControllerSetup (final ControllerHost host)
    {
        return new MaschineControllerSetup (new HostImpl (host), new BitwigSetupFactory (host), new SettingsUIImpl (host, host.getPreferences ()), new SettingsUIImpl (host, host.getDocumentState ()), Maschine.PLUS);
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/ni/maschine/mk3/MaschineStudioExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.ni.maschine.mk3;

import de.mossgrabers.bitwig.framework.BitwigSetupFactory;
import de.mossgrabers.bitwig.framework.configuration.SettingsUIImpl;
import de.mossgrabers.bitwig.framework.daw.HostImpl;
import de.mossgrabers.bitwig.framework.extension.AbstractControllerExtensionDefinition;
import de.mossgrabers.controller.ni.maschine.Maschine;
import de.mossgrabers.controller.ni.maschine.mk3.MaschineConfiguration;
import de.mossgrabers.controller.ni.maschine.mk3.MaschineControllerSetup;
import de.mossgrabers.controller.ni.maschine.mk3.MaschineStudioControllerDefinition;
import de.mossgrabers.controller.ni.maschine.mk3.controller.MaschineControlSurface;
import de.mossgrabers.framework.controller.IControllerSetup;

import com.bitwig.extension.controller.api.ControllerHost;


/**
 * Definition class for the NI Maschine Studio controller.
 *
 * @author Jürgen Moßgraber
 */
public class MaschineStudioExtensionDefinition extends AbstractControllerExtensionDefinition<MaschineControlSurface, MaschineConfiguration>
{
    /**
     * Constructor.
     */
    public MaschineStudioExtensionDefinition ()
    {
        super (new MaschineStudioControllerDefinition ());
    }


    /** {@inheritDoc} */
    @Override
    protected IControllerSetup<MaschineControlSurface, MaschineConfiguration> getControllerSetup (final ControllerHost host)
    {
        return new MaschineControllerSetup (new HostImpl (host), new BitwigSetupFactory (host), new SettingsUIImpl (host, host.getPreferences ()), new SettingsUIImpl (host, host.getDocumentState ()), Maschine.STUDIO);
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/novation/launchcontrol/LaunchControlXLControllerExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.novation.launchcontrol;

import de.mossgrabers.bitwig.framework.BitwigSetupFactory;
import de.mossgrabers.bitwig.framework.configuration.SettingsUIImpl;
import de.mossgrabers.bitwig.framework.daw.HostImpl;
import de.mossgrabers.bitwig.framework.extension.AbstractControllerExtensionDefinition;
import de.mossgrabers.controller.novation.launchcontrol.LaunchControlXLConfiguration;
import de.mossgrabers.controller.novation.launchcontrol.LaunchControlXLControllerDefinition;
import de.mossgrabers.controller.novation.launchcontrol.LaunchControlXLControllerSetup;
import de.mossgrabers.controller.novation.launchcontrol.controller.LaunchControlXLControlSurface;
import de.mossgrabers.framework.controller.IControllerSetup;

import com.bitwig.extension.controller.api.ControllerHost;


/**
 * Definition class for the LaunchControl XL controller extension.
 *
 * @author Jürgen Moßgraber
 */
public class LaunchControlXLControllerExtensionDefinition extends AbstractControllerExtensionDefinition<LaunchControlXLControlSurface, LaunchControlXLConfiguration>
{
    private static final LaunchControlXLControllerDefinition DEFINITION = new LaunchControlXLControllerDefinition ();


    /**
     * Constructor.
     */
    public LaunchControlXLControllerExtensionDefinition ()
    {
        super (DEFINITION);
    }


    /** {@inheritDoc} */
    @Override
    protected IControllerSetup<LaunchControlXLControlSurface, LaunchControlXLConfiguration> getControllerSetup (final ControllerHost host)
    {
        return new LaunchControlXLControllerSetup (new HostImpl (host), new BitwigSetupFactory (host), new SettingsUIImpl (host, host.getPreferences ()), new SettingsUIImpl (host, host.getDocumentState ()));
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/novation/launchkey/LaunchkeyMiniMk3ControllerExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.novation.launchkey;

import de.mossgrabers.bitwig.framework.BitwigSetupFactory;
import de.mossgrabers.bitwig.framework.configuration.SettingsUIImpl;
import de.mossgrabers.bitwig.framework.daw.HostImpl;
import de.mossgrabers.bitwig.framework.extension.AbstractControllerExtensionDefinition;
import de.mossgrabers.controller.novation.launchkey.mini.LaunchkeyMiniMk3Configuration;
import de.mossgrabers.controller.novation.launchkey.mini.LaunchkeyMiniMk3ControllerDefinition;
import de.mossgrabers.controller.novation.launchkey.mini.LaunchkeyMiniMk3ControllerSetup;
import de.mossgrabers.controller.novation.launchkey.mini.controller.LaunchkeyMiniMk3ControlSurface;
import de.mossgrabers.framework.controller.IControllerSetup;

import com.bitwig.extension.controller.api.ControllerHost;


/**
 * Definition class for the Launchkey Mini Mk3 controller extension.
 *
 * @author Jürgen Moßgraber
 */
public class LaunchkeyMiniMk3ControllerExtensionDefinition extends AbstractControllerExtensionDefinition<LaunchkeyMiniMk3ControlSurface, LaunchkeyMiniMk3Configuration>
{
    private static final LaunchkeyMiniMk3ControllerDefinition DEFINITION = new LaunchkeyMiniMk3ControllerDefinition ();


    /**
     * Constructor.
     */
    public LaunchkeyMiniMk3ControllerExtensionDefinition ()
    {
        super (DEFINITION);
    }


    /** {@inheritDoc} */
    @Override
    protected IControllerSetup<LaunchkeyMiniMk3ControlSurface, LaunchkeyMiniMk3Configuration> getControllerSetup (final ControllerHost host)
    {
        return new LaunchkeyMiniMk3ControllerSetup (new HostImpl (host), new BitwigSetupFactory (host), new SettingsUIImpl (host, host.getPreferences ()), new SettingsUIImpl (host, host.getDocumentState ()));
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/novation/launchkey/LaunchkeyMk3ControllerExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.novation.launchkey;

import de.mossgrabers.bitwig.framework.BitwigSetupFactory;
import de.mossgrabers.bitwig.framework.configuration.SettingsUIImpl;
import de.mossgrabers.bitwig.framework.daw.HostImpl;
import de.mossgrabers.bitwig.framework.extension.AbstractControllerExtensionDefinition;
import de.mossgrabers.controller.novation.launchkey.maxi.LaunchkeyMk3Configuration;
import de.mossgrabers.controller.novation.launchkey.maxi.LaunchkeyMk3ControllerDefinition;
import de.mossgrabers.controller.novation.launchkey.maxi.LaunchkeyMk3ControllerSetup;
import de.mossgrabers.controller.novation.launchkey.maxi.controller.LaunchkeyMk3ControlSurface;
import de.mossgrabers.framework.controller.IControllerSetup;

import com.bitwig.extension.controller.api.ControllerHost;


/**
 * Definition class for the Launchkey Mk3 controller extension.
 *
 * @author Jürgen Moßgraber
 */
public class LaunchkeyMk3ControllerExtensionDefinition extends AbstractControllerExtensionDefinition<LaunchkeyMk3ControlSurface, LaunchkeyMk3Configuration>
{
    private static final LaunchkeyMk3ControllerDefinition DEFINITION = new LaunchkeyMk3ControllerDefinition ();


    /**
     * Constructor.
     */
    public LaunchkeyMk3ControllerExtensionDefinition ()
    {
        super (DEFINITION);
    }


    /** {@inheritDoc} */
    @Override
    protected IControllerSetup<LaunchkeyMk3ControlSurface, LaunchkeyMk3Configuration> getControllerSetup (final ControllerHost host)
    {
        return new LaunchkeyMk3ControllerSetup (new HostImpl (host), new BitwigSetupFactory (host), new SettingsUIImpl (host, host.getPreferences ()), new SettingsUIImpl (host, host.getDocumentState ()));
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/novation/launchpad/LaunchpadMiniMkIIIControllerExtensionDefinition.java
================================================
[Binary file]


================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/novation/launchpad/LaunchpadMkIIControllerExtensionDefinition.java
================================================
[Binary file]


================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/novation/launchpad/LaunchpadProControllerExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.novation.launchpad;

import de.mossgrabers.bitwig.framework.BitwigSetupFactory;
import de.mossgrabers.bitwig.framework.configuration.SettingsUIImpl;
import de.mossgrabers.bitwig.framework.daw.HostImpl;
import de.mossgrabers.bitwig.framework.extension.AbstractControllerExtensionDefinition;
import de.mossgrabers.controller.novation.launchpad.LaunchpadConfiguration;
import de.mossgrabers.controller.novation.launchpad.LaunchpadControllerSetup;
import de.mossgrabers.controller.novation.launchpad.controller.LaunchpadControlSurface;
import de.mossgrabers.controller.novation.launchpad.definition.LaunchpadProControllerDefinition;
import de.mossgrabers.framework.controller.IControllerSetup;

import com.bitwig.extension.controller.api.ControllerHost;


/**
 * Definition class for the Launchpad Pro extension.
 *
 * @author Jürgen Moßgraber
 */
public class LaunchpadProControllerExtensionDefinition extends AbstractControllerExtensionDefinition<LaunchpadControlSurface, LaunchpadConfiguration>
{
    private static final LaunchpadProControllerDefinition DEFINITION = new LaunchpadProControllerDefinition ();


    /**
     * Constructor.
     */
    public LaunchpadProControllerExtensionDefinition ()
    {
        super (DEFINITION);
    }


    /** {@inheritDoc} */
    @Override
    protected IControllerSetup<LaunchpadControlSurface, LaunchpadConfiguration> getControllerSetup (final ControllerHost host)
    {
        return new LaunchpadControllerSetup (new HostImpl (host), new BitwigSetupFactory (host), new SettingsUIImpl (host, host.getPreferences ()), new SettingsUIImpl (host, host.getDocumentState ()), DEFINITION);
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/novation/launchpad/LaunchpadProMk3ControllerExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.novation.launchpad;

import de.mossgrabers.bitwig.framework.BitwigSetupFactory;
import de.mossgrabers.bitwig.framework.configuration.SettingsUIImpl;
import de.mossgrabers.bitwig.framework.daw.HostImpl;
import de.mossgrabers.bitwig.framework.extension.AbstractControllerExtensionDefinition;
import de.mossgrabers.controller.novation.launchpad.LaunchpadConfiguration;
import de.mossgrabers.controller.novation.launchpad.LaunchpadControllerSetup;
import de.mossgrabers.controller.novation.launchpad.controller.LaunchpadControlSurface;
import de.mossgrabers.controller.novation.launchpad.definition.LaunchpadProMk3ControllerDefinition;
import de.mossgrabers.framework.controller.IControllerSetup;

import com.bitwig.extension.controller.api.ControllerHost;


/**
 * Definition class for the Launchpad Pro Mk3 extension.
 *
 * @author Jürgen Moßgraber
 */
public class LaunchpadProMk3ControllerExtensionDefinition extends AbstractControllerExtensionDefinition<LaunchpadControlSurface, LaunchpadConfiguration>
{
    private static final LaunchpadProMk3ControllerDefinition DEFINITION = new LaunchpadProMk3ControllerDefinition ();


    /**
     * Constructor.
     */
    public LaunchpadProMk3ControllerExtensionDefinition ()
    {
        super (DEFINITION);
    }


    /** {@inheritDoc} */
    @Override
    protected IControllerSetup<LaunchpadControlSurface, LaunchpadConfiguration> getControllerSetup (final ControllerHost host)
    {
        return new LaunchpadControllerSetup (new HostImpl (host), new BitwigSetupFactory (host), new SettingsUIImpl (host, host.getPreferences ()), new SettingsUIImpl (host, host.getDocumentState ()), DEFINITION);
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/novation/launchpad/LaunchpadXControllerExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.novation.launchpad;

import de.mossgrabers.bitwig.framework.BitwigSetupFactory;
import de.mossgrabers.bitwig.framework.configuration.SettingsUIImpl;
import de.mossgrabers.bitwig.framework.daw.HostImpl;
import de.mossgrabers.bitwig.framework.extension.AbstractControllerExtensionDefinition;
import de.mossgrabers.controller.novation.launchpad.LaunchpadConfiguration;
import de.mossgrabers.controller.novation.launchpad.LaunchpadControllerSetup;
import de.mossgrabers.controller.novation.launchpad.controller.LaunchpadControlSurface;
import de.mossgrabers.controller.novation.launchpad.definition.LaunchpadXControllerDefinition;
import de.mossgrabers.framework.controller.IControllerSetup;

import com.bitwig.extension.controller.api.ControllerHost;


/**
 * Definition class for the Launchpad X extension.
 *
 * @author Jürgen Moßgraber
 */
public class LaunchpadXControllerExtensionDefinition extends AbstractControllerExtensionDefinition<LaunchpadControlSurface, LaunchpadConfiguration>
{
    private static final LaunchpadXControllerDefinition DEFINITION = new LaunchpadXControllerDefinition ();


    /**
     * Constructor.
     */
    public LaunchpadXControllerExtensionDefinition ()
    {
        super (DEFINITION);
    }


    /** {@inheritDoc} */
    @Override
    protected IControllerSetup<LaunchpadControlSurface, LaunchpadConfiguration> getControllerSetup (final ControllerHost host)
    {
        return new LaunchpadControllerSetup (new HostImpl (host), new BitwigSetupFactory (host), new SettingsUIImpl (host, host.getPreferences ()), new SettingsUIImpl (host, host.getDocumentState ()), DEFINITION);
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/novation/sl/SLMkIControllerExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.novation.sl;

import de.mossgrabers.bitwig.framework.BitwigSetupFactory;
import de.mossgrabers.bitwig.framework.configuration.SettingsUIImpl;
import de.mossgrabers.bitwig.framework.daw.HostImpl;
import de.mossgrabers.bitwig.framework.extension.AbstractControllerExtensionDefinition;
import de.mossgrabers.controller.novation.sl.SLConfiguration;
import de.mossgrabers.controller.novation.sl.SLControllerDefinition;
import de.mossgrabers.controller.novation.sl.SLControllerSetup;
import de.mossgrabers.controller.novation.sl.controller.SLControlSurface;
import de.mossgrabers.framework.controller.IControllerSetup;

import com.bitwig.extension.controller.api.ControllerHost;


/**
 * Definition class for the Novation SLmkI controller extension.
 *
 * @author Jürgen Moßgraber
 */
public class SLMkIControllerExtensionDefinition extends AbstractControllerExtensionDefinition<SLControlSurface, SLConfiguration>
{
    /**
     * Constructor.
     */
    public SLMkIControllerExtensionDefinition ()
    {
        super (new SLControllerDefinition (false));
    }


    /** {@inheritDoc} */
    @Override
    protected IControllerSetup<SLControlSurface, SLConfiguration> getControllerSetup (final ControllerHost host)
    {
        return new SLControllerSetup (new HostImpl (host), new BitwigSetupFactory (host), new SettingsUIImpl (host, host.getPreferences ()), new SettingsUIImpl (host, host.getDocumentState ()), false);
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/novation/sl/SLMkIIControllerExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.novation.sl;

import de.mossgrabers.bitwig.framework.BitwigSetupFactory;
import de.mossgrabers.bitwig.framework.configuration.SettingsUIImpl;
import de.mossgrabers.bitwig.framework.daw.HostImpl;
import de.mossgrabers.bitwig.framework.extension.AbstractControllerExtensionDefinition;
import de.mossgrabers.controller.novation.sl.SLConfiguration;
import de.mossgrabers.controller.novation.sl.SLControllerDefinition;
import de.mossgrabers.controller.novation.sl.SLControllerSetup;
import de.mossgrabers.controller.novation.sl.controller.SLControlSurface;
import de.mossgrabers.framework.controller.IControllerSetup;

import com.bitwig.extension.controller.api.ControllerHost;


/**
 * Definition class for the Novation SLmkII controller extension.
 *
 * @author Jürgen Moßgraber
 */
public class SLMkIIControllerExtensionDefinition extends AbstractControllerExtensionDefinition<SLControlSurface, SLConfiguration>
{
    /**
     * Constructor.
     */
    public SLMkIIControllerExtensionDefinition ()
    {
        super (new SLControllerDefinition (true));
    }


    /** {@inheritDoc} */
    @Override
    protected IControllerSetup<SLControlSurface, SLConfiguration> getControllerSetup (final ControllerHost host)
    {
        return new SLControllerSetup (new HostImpl (host), new BitwigSetupFactory (host), new SettingsUIImpl (host, host.getPreferences ()), new SettingsUIImpl (host, host.getDocumentState ()), true);
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/novation/slmkiii/SLMkIIIControllerExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.novation.slmkiii;

import de.mossgrabers.bitwig.framework.BitwigSetupFactory;
import de.mossgrabers.bitwig.framework.configuration.SettingsUIImpl;
import de.mossgrabers.bitwig.framework.daw.HostImpl;
import de.mossgrabers.bitwig.framework.extension.AbstractControllerExtensionDefinition;
import de.mossgrabers.controller.novation.slmkiii.SLMkIIIConfiguration;
import de.mossgrabers.controller.novation.slmkiii.SLMkIIIControllerDefinition;
import de.mossgrabers.controller.novation.slmkiii.SLMkIIIControllerSetup;
import de.mossgrabers.controller.novation.slmkiii.controller.SLMkIIIControlSurface;
import de.mossgrabers.framework.controller.IControllerSetup;

import com.bitwig.extension.controller.api.ControllerHost;


/**
 * Definition class for the Novation SLmkIII controller extension.
 *
 * @author Jürgen Moßgraber
 */
public class SLMkIIIControllerExtensionDefinition extends AbstractControllerExtensionDefinition<SLMkIIIControlSurface, SLMkIIIConfiguration>
{
    /**
     * Constructor.
     */
    public SLMkIIIControllerExtensionDefinition ()
    {
        super (new SLMkIIIControllerDefinition ());
    }


    /** {@inheritDoc} */
    @Override
    protected IControllerSetup<SLMkIIIControlSurface, SLMkIIIConfiguration> getControllerSetup (final ControllerHost host)
    {
        return new SLMkIIIControllerSetup (new HostImpl (host), new BitwigSetupFactory (host), new SettingsUIImpl (host, host.getPreferences ()), new SettingsUIImpl (host, host.getDocumentState ()));
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/osc/OSCControllerExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.osc;

import de.mossgrabers.bitwig.framework.BitwigSetupFactory;
import de.mossgrabers.bitwig.framework.configuration.SettingsUIImpl;
import de.mossgrabers.bitwig.framework.daw.HostImpl;
import de.mossgrabers.bitwig.framework.extension.AbstractControllerExtensionDefinition;
import de.mossgrabers.controller.osc.OSCConfiguration;
import de.mossgrabers.controller.osc.OSCControllerDefinition;
import de.mossgrabers.controller.osc.OSCControllerSetup;
import de.mossgrabers.framework.controller.IControlSurface;
import de.mossgrabers.framework.controller.IControllerSetup;

import com.bitwig.extension.controller.api.ControllerHost;


/**
 * Definition class for the Akai OSC controller.
 *
 * @author Jürgen Moßgraber
 */
public class OSCControllerExtensionDefinition extends AbstractControllerExtensionDefinition<IControlSurface<OSCConfiguration>, OSCConfiguration>
{
    /**
     * Constructor.
     */
    public OSCControllerExtensionDefinition ()
    {
        super (new OSCControllerDefinition ());
    }


    /** {@inheritDoc} */
    @Override
    protected IControllerSetup<IControlSurface<OSCConfiguration>, OSCConfiguration> getControllerSetup (final ControllerHost host)
    {
        return new OSCControllerSetup (new HostImpl (host), new BitwigSetupFactory (host), new SettingsUIImpl (host, host.getPreferences ()), new SettingsUIImpl (host, host.getDocumentState ()));
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/oxi/one/OxiOneControllerExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.oxi.one;

import com.bitwig.extension.controller.api.ControllerHost;

import de.mossgrabers.bitwig.framework.BitwigSetupFactory;
import de.mossgrabers.bitwig.framework.configuration.SettingsUIImpl;
import de.mossgrabers.bitwig.framework.daw.HostImpl;
import de.mossgrabers.bitwig.framework.extension.AbstractControllerExtensionDefinition;
import de.mossgrabers.controller.oxi.one.OxiOneConfiguration;
import de.mossgrabers.controller.oxi.one.OxiOneControllerDefinition;
import de.mossgrabers.controller.oxi.one.OxiOneControllerSetup;
import de.mossgrabers.controller.oxi.one.controller.OxiOneControlSurface;
import de.mossgrabers.framework.controller.IControllerSetup;


/**
 * Definition class for the OXI One.
 *
 * @author Jürgen Moßgraber
 */
public class OxiOneControllerExtensionDefinition extends AbstractControllerExtensionDefinition<OxiOneControlSurface, OxiOneConfiguration>
{
    /**
     * Constructor.
     */
    public OxiOneControllerExtensionDefinition ()
    {
        super (new OxiOneControllerDefinition ());
    }


    /** {@inheritDoc} */
    @Override
    protected IControllerSetup<OxiOneControlSurface, OxiOneConfiguration> getControllerSetup (final ControllerHost host)
    {
        return new OxiOneControllerSetup (new HostImpl (host), new BitwigSetupFactory (host), new SettingsUIImpl (host, host.getPreferences ()), new SettingsUIImpl (host, host.getDocumentState ()));
    }


    /** {@inheritDoc} */
    @Override
    public boolean isUsingBetaAPI ()
    {
        return true;
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/utilities/autocolor/AutoColorExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.utilities.autocolor;

import de.mossgrabers.bitwig.framework.BitwigSetupFactory;
import de.mossgrabers.bitwig.framework.configuration.SettingsUIImpl;
import de.mossgrabers.bitwig.framework.daw.HostImpl;
import de.mossgrabers.bitwig.framework.extension.AbstractControllerExtensionDefinition;
import de.mossgrabers.controller.utilities.autocolor.AutoColorConfiguration;
import de.mossgrabers.controller.utilities.autocolor.AutoColorDefinition;
import de.mossgrabers.controller.utilities.autocolor.AutoColorSetup;
import de.mossgrabers.framework.controller.IControlSurface;
import de.mossgrabers.framework.controller.IControllerSetup;

import com.bitwig.extension.controller.api.ControllerHost;


/**
 * Definition class for Auto Color.
 *
 * @author Jürgen Moßgraber
 */
public class AutoColorExtensionDefinition extends AbstractControllerExtensionDefinition<IControlSurface<AutoColorConfiguration>, AutoColorConfiguration>
{
    /**
     * Constructor.
     */
    public AutoColorExtensionDefinition ()
    {
        super (new AutoColorDefinition ());
    }


    /** {@inheritDoc} */
    @Override
    protected IControllerSetup<IControlSurface<AutoColorConfiguration>, AutoColorConfiguration> getControllerSetup (final ControllerHost host)
    {
        return new AutoColorSetup (new HostImpl (host), new BitwigSetupFactory (host), new SettingsUIImpl (host, host.getPreferences ()), new SettingsUIImpl (host, host.getDocumentState ()));
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/utilities/midimonitor/MidiMonitorExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.utilities.midimonitor;

import de.mossgrabers.bitwig.framework.BitwigSetupFactory;
import de.mossgrabers.bitwig.framework.configuration.SettingsUIImpl;
import de.mossgrabers.bitwig.framework.daw.HostImpl;
import de.mossgrabers.bitwig.framework.extension.AbstractControllerExtensionDefinition;
import de.mossgrabers.controller.utilities.midimonitor.MidiMonitorConfiguration;
import de.mossgrabers.controller.utilities.midimonitor.MidiMonitorDefinition;
import de.mossgrabers.controller.utilities.midimonitor.MidiMonitorSetup;
import de.mossgrabers.framework.controller.IControlSurface;
import de.mossgrabers.framework.controller.IControllerSetup;

import com.bitwig.extension.controller.api.ControllerHost;


/**
 * Definition class for the MIDI Monitor.
 *
 * @author Jürgen Moßgraber
 */
public class MidiMonitorExtensionDefinition extends AbstractControllerExtensionDefinition<IControlSurface<MidiMonitorConfiguration>, MidiMonitorConfiguration>
{
    /**
     * Constructor.
     */
    public MidiMonitorExtensionDefinition ()
    {
        super (new MidiMonitorDefinition ());
    }


    /** {@inheritDoc} */
    @Override
    protected IControllerSetup<IControlSurface<MidiMonitorConfiguration>, MidiMonitorConfiguration> getControllerSetup (final ControllerHost host)
    {
        return new MidiMonitorSetup (new HostImpl (host), new BitwigSetupFactory (host), new SettingsUIImpl (host, host.getPreferences ()), new SettingsUIImpl (host, host.getDocumentState ()));
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/controller/yaeltex/turn/YaeltexTurnControllerExtensionDefinition.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.controller.yaeltex.turn;

import de.mossgrabers.bitwig.framework.BitwigSetupFactory;
import de.mossgrabers.bitwig.framework.configuration.SettingsUIImpl;
import de.mossgrabers.bitwig.framework.daw.HostImpl;
import de.mossgrabers.bitwig.framework.extension.AbstractControllerExtensionDefinition;
import de.mossgrabers.controller.yaeltex.turn.YaeltexTurnConfiguration;
import de.mossgrabers.controller.yaeltex.turn.YaeltexTurnControllerDefinition;
import de.mossgrabers.controller.yaeltex.turn.YaeltexTurnControllerSetup;
import de.mossgrabers.controller.yaeltex.turn.controller.YaeltexTurnControlSurface;
import de.mossgrabers.framework.controller.IControllerSetup;

import com.bitwig.extension.controller.api.ControllerHost;


/**
 * Definition class for the Yaeltex Turn controller extension.
 *
 * @author Jürgen Moßgraber
 */
public class YaeltexTurnControllerExtensionDefinition extends AbstractControllerExtensionDefinition<YaeltexTurnControlSurface, YaeltexTurnConfiguration>
{
    /**
     * Constructor.
     */
    public YaeltexTurnControllerExtensionDefinition ()
    {
        super (new YaeltexTurnControllerDefinition ());
    }


    /** {@inheritDoc} */
    @Override
    protected IControllerSetup<YaeltexTurnControlSurface, YaeltexTurnConfiguration> getControllerSetup (final ControllerHost host)
    {
        return new YaeltexTurnControllerSetup (new HostImpl (host), new BitwigSetupFactory (host), new SettingsUIImpl (host, host.getPreferences ()), new SettingsUIImpl (host, host.getDocumentState ()));
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/framework/BitwigSetupFactory.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.framework;

import de.mossgrabers.bitwig.framework.daw.HostImpl;
import de.mossgrabers.bitwig.framework.daw.ModelImpl;
import de.mossgrabers.bitwig.framework.midi.MidiDeviceImpl;
import de.mossgrabers.framework.configuration.Configuration;
import de.mossgrabers.framework.controller.ISetupFactory;
import de.mossgrabers.framework.controller.color.ColorManager;
import de.mossgrabers.framework.controller.valuechanger.IValueChanger;
import de.mossgrabers.framework.daw.DataSetup;
import de.mossgrabers.framework.daw.IModel;
import de.mossgrabers.framework.daw.ModelSetup;
import de.mossgrabers.framework.daw.midi.ArpeggiatorMode;
import de.mossgrabers.framework.daw.midi.IMidiAccess;
import de.mossgrabers.framework.scale.Scales;

import com.bitwig.extension.controller.api.ControllerHost;

import java.util.Arrays;
import java.util.List;


/**
 * Factory for creating Bitwig objects.
 *
 * @author Jürgen Moßgraber
 */
public class BitwigSetupFactory implements ISetupFactory
{
    private final ControllerHost               controllerHost;

    private static final List<ArpeggiatorMode> ARP_MODES = Arrays.asList (ArpeggiatorMode.values ());


    /**
     * Constructor.
     *
     * @param controllerHost The DAW host
     */
    public BitwigSetupFactory (final ControllerHost controllerHost)
    {
        this.controllerHost = controllerHost;
    }


    /** {@inheritDoc} */
    @Override
    public IModel createModel (final Configuration configuration, final ColorManager colorManager, final IValueChanger valueChanger, final Scales scales, final ModelSetup modelSetup)
    {
        final DataSetup dataSetup = new DataSetup (new HostImpl (this.controllerHost), valueChanger, colorManager);
        return new ModelImpl (modelSetup, dataSetup, this.controllerHost, scales);
    }


    /** {@inheritDoc} */
    @Override
    public IMidiAccess createMidiAccess ()
    {
        return new MidiDeviceImpl (this.controllerHost);
    }


    /** {@inheritDoc} */
    @Override
    public List<ArpeggiatorMode> getArpeggiatorModes ()
    {
        return ARP_MODES;
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/framework/configuration/AbstractSetting.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.framework.configuration;

import de.mossgrabers.framework.configuration.ISetting;

import com.bitwig.extension.controller.api.Setting;


/**
 * Abstract base class for all Bitwig settings.
 *
 * @author Jürgen Moßgraber
 */
public abstract class AbstractSetting implements ISetting
{
    protected Setting setting;


    /**
     * Constructor.
     *
     * @param setting The Bitwig setting
     */
    protected AbstractSetting (final Setting setting)
    {
        this.setting = setting;
    }


    /** {@inheritDoc} */
    @Override
    public void setEnabled (final boolean enable)
    {
        if (enable)
            this.setting.enable ();
        else
            this.setting.disable ();
    }


    /** {@inheritDoc} */
    @Override
    public void setVisible (final boolean visible)
    {
        if (visible)
            this.setting.show ();
        else
            this.setting.hide ();
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/framework/configuration/ActionSettingImpl.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.framework.configuration;

import de.mossgrabers.framework.configuration.IActionSetting;
import de.mossgrabers.framework.observer.IValueObserver;

import com.bitwig.extension.controller.api.SettableEnumValue;
import com.bitwig.extension.controller.api.Setting;

import java.util.Map;


/**
 * Bitwig implementation of an action setting.
 *
 * @author Jürgen Moßgraber
 */
public class ActionSettingImpl implements IActionSetting
{
    private final SettableEnumValue              categorySetting;
    private final Map<String, String>            actionsMap;
    private final Map<String, SettableEnumValue> categoryActionsSettings;
    private final Map<String, String>            actionCategories;
    private IValueObserver<String>               observer;


    /**
     * Constructor.
     *
     * @param categorySetting The action category enumeration
     * @param categoryActionsSettings The category to action name map
     * @param actionsMap The action map for looking up the ID of the selected action
     * @param actionCategories
     */
    public ActionSettingImpl (final SettableEnumValue categorySetting, final Map<String, SettableEnumValue> categoryActionsSettings, final Map<String, String> actionsMap, final Map<String, String> actionCategories)
    {
        this.categorySetting = categorySetting;
        this.categoryActionsSettings = categoryActionsSettings;
        this.actionsMap = actionsMap;
        this.actionCategories = actionCategories;

        this.categorySetting.addValueObserver (category -> {

            final SettableEnumValue categoryActionsSetting = this.categoryActionsSettings.get (category);
            if (categoryActionsSetting == null)
                return;

            // Only show the actions list of the category
            for (final SettableEnumValue setting: this.categoryActionsSettings.values ())
            {
                if (setting == categoryActionsSetting)
                    ((Setting) setting).show ();
                else
                    ((Setting) setting).hide ();
            }

        });
    }


    /** {@inheritDoc} */
    @Override
    public void set (final String actionID)
    {
        final String category = this.actionCategories.get (actionID);
        final String actionName = this.actionsMap.get (actionID);

        // Could only happen if actions would be removed
        if (category == null || actionName == null)
            return;

        // Select the category of the action
        this.categorySetting.set (category);

        final SettableEnumValue categoryActionsSetting = this.categoryActionsSettings.get (category);
        if (categoryActionsSetting == null)
            return;

        // Only show the actions list of the category
        for (final SettableEnumValue setting: this.categoryActionsSettings.values ())
        {
            if (setting == categoryActionsSetting)
                ((Setting) setting).show ();
            else
                ((Setting) setting).hide ();
        }

        // Finally select the action
        categoryActionsSetting.set (actionName);
    }


    /** {@inheritDoc} */
    @Override
    public String get ()
    {
        // Get the setting for the selected category
        final String selectedCategory = this.categorySetting.get ();
        final SettableEnumValue setting = this.categoryActionsSettings.get (selectedCategory);
        if (setting == null)
            return this.actionsMap.keySet ().iterator ().next ();

        // Get and return the ID of the selected action
        final String actionName = setting.get ();
        for (final Map.Entry<String, String> e: this.actionsMap.entrySet ())
        {
            if (e.getValue ().equals (actionName))
                return e.getKey ();
        }
        return this.actionsMap.keySet ().iterator ().next ();
    }


    /** {@inheritDoc} */
    @Override
    public void addValueObserver (final IValueObserver<String> observer)
    {
        this.observer = observer;

        this.categorySetting.addValueObserver (value -> this.notifyOberserver ());
        for (final SettableEnumValue setting: this.categoryActionsSettings.values ())
            setting.addValueObserver (value -> this.notifyOberserver ());

        // Directly fire the current value
        observer.update (this.get ());
    }


    private void notifyOberserver ()
    {
        this.observer.update (this.get ());
    }


    /** {@inheritDoc} */
    @Override
    public void setEnabled (final boolean enable)
    {
        // Not used, implement if required
    }


    /** {@inheritDoc} */
    @Override
    public void setVisible (final boolean visible)
    {
        // Not used, implement if required
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/framework/configuration/BooleanSettingImpl.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.framework.configuration;

import de.mossgrabers.framework.configuration.IBooleanSetting;
import de.mossgrabers.framework.observer.IValueObserver;

import com.bitwig.extension.controller.api.SettableBooleanValue;
import com.bitwig.extension.controller.api.Setting;


/**
 * Bitwig implementation of a boolean setting.
 *
 * @author Jürgen Moßgraber
 */
public class BooleanSettingImpl extends AbstractSetting implements IBooleanSetting
{
    private final SettableBooleanValue booleanValue;


    /**
     * Constructor.
     *
     * @param booleanValue The ranged value
     */
    public BooleanSettingImpl (final SettableBooleanValue booleanValue)
    {
        super ((Setting) booleanValue);

        this.booleanValue = booleanValue;
    }


    /** {@inheritDoc} */
    @Override
    public void set (final boolean value)
    {
        this.booleanValue.set (value);
    }


    /** {@inheritDoc} */
    @Override
    public void set (final Boolean value)
    {
        this.set (value.booleanValue ());
    }


    /** {@inheritDoc} */
    @Override
    public Boolean get ()
    {
        return Boolean.valueOf (this.booleanValue.get ());
    }


    /** {@inheritDoc} */
    @Override
    public void addValueObserver (final IValueObserver<Boolean> observer)
    {
        this.booleanValue.addValueObserver (value -> observer.update (Boolean.valueOf (value)));

        // Directly fire the current value
        observer.update (Boolean.valueOf (this.booleanValue.get ()));
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/framework/configuration/ColorSettingImpl.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.framework.configuration;

import de.mossgrabers.framework.configuration.IColorSetting;
import de.mossgrabers.framework.controller.color.ColorEx;
import de.mossgrabers.framework.observer.IValueObserver;

import com.bitwig.extension.api.Color;
import com.bitwig.extension.controller.api.SettableColorValue;
import com.bitwig.extension.controller.api.Setting;


/**
 * Bitwig implementation of a color setting.
 *
 * @author Jürgen Moßgraber
 */
public class ColorSettingImpl extends AbstractSetting implements IColorSetting
{
    private final SettableColorValue colorValue;


    /**
     * Constructor.
     *
     * @param colorValue The color value
     */
    public ColorSettingImpl (final SettableColorValue colorValue)
    {
        super ((Setting) colorValue);

        this.colorValue = colorValue;
    }


    /** {@inheritDoc} */
    @Override
    public void set (final double red, final double green, final double blue)
    {
        this.colorValue.set ((float) red, (float) green, (float) blue);
    }


    /** {@inheritDoc} */
    @Override
    public void set (final double [] rgb)
    {
        this.set (rgb[0], rgb[1], rgb[2]);
    }


    /** {@inheritDoc} */
    @Override
    public void set (final ColorEx color)
    {
        this.set (color.getRed (), color.getGreen (), color.getBlue ());
    }


    /** {@inheritDoc} */
    @Override
    public ColorEx get ()
    {
        final Color color = this.colorValue.get ();
        if (color == null)
            return ColorEx.BLACK;
        return new ColorEx (color.getRed (), color.getGreen (), color.getBlue ());
    }


    /** {@inheritDoc} */
    @Override
    public void addValueObserver (final IValueObserver<ColorEx> observer)
    {
        this.colorValue.addValueObserver ( (red, green, blue) -> observer.update (new ColorEx (red, green, blue)));

        // Directly fire the current value
        final Color color = this.colorValue.get ();
        observer.update (new ColorEx (color.getRed (), color.getGreen (), color.getBlue ()));
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/framework/configuration/DoubleSettingImpl.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.framework.configuration;

import de.mossgrabers.framework.configuration.IDoubleSetting;
import de.mossgrabers.framework.observer.IValueObserver;

import com.bitwig.extension.controller.api.SettableRangedValue;
import com.bitwig.extension.controller.api.Setting;


/**
 * Bitwig implementation of a double setting.
 *
 * @author Jürgen Moßgraber
 */
public class DoubleSettingImpl extends AbstractSetting implements IDoubleSetting
{
    private final SettableRangedValue rangedValue;


    /**
     * Constructor.
     *
     * @param rangedValue The range value
     */
    public DoubleSettingImpl (final SettableRangedValue rangedValue)
    {
        super ((Setting) rangedValue);

        this.rangedValue = rangedValue;
    }


    /** {@inheritDoc} */
    @Override
    public void set (final double value)
    {
        this.rangedValue.setRaw (value);
    }


    /** {@inheritDoc} */
    @Override
    public void set (final Double value)
    {
        this.set (value.doubleValue ());
    }


    /** {@inheritDoc} */
    @Override
    public Double get ()
    {
        return Double.valueOf (this.rangedValue.get ());
    }


    /** {@inheritDoc} */
    @Override
    public void addValueObserver (final IValueObserver<Double> observer)
    {
        this.rangedValue.addValueObserver (value -> observer.update (Double.valueOf (value)));

        // Directly fire the current value
        observer.update (Double.valueOf (this.rangedValue.get ()));
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/framework/configuration/EnumSettingImpl.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.framework.configuration;

import de.mossgrabers.framework.configuration.IEnumSetting;
import de.mossgrabers.framework.observer.IValueObserver;

import com.bitwig.extension.controller.api.SettableEnumValue;
import com.bitwig.extension.controller.api.Setting;


/**
 * Bitwig implementation of an enumeration setting.
 *
 * @author Jürgen Moßgraber
 */
public class EnumSettingImpl extends AbstractSetting implements IEnumSetting
{
    private final SettableEnumValue enumValue;


    /**
     * Constructor.
     *
     * @param enumValue The enumeration value
     */
    public EnumSettingImpl (final SettableEnumValue enumValue)
    {
        super ((Setting) enumValue);

        this.enumValue = enumValue;
    }


    /** {@inheritDoc} */
    @Override
    public void set (final String value)
    {
        this.enumValue.set (value);
    }


    /** {@inheritDoc} */
    @Override
    public String get ()
    {
        return this.enumValue.get ();
    }


    /** {@inheritDoc} */
    @Override
    public void addValueObserver (final IValueObserver<String> observer)
    {
        this.enumValue.addValueObserver (observer::update);

        // Directly fire the current value
        observer.update (this.enumValue.get ());
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/framework/configuration/IntegerSettingImpl.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.framework.configuration;

import de.mossgrabers.framework.configuration.IIntegerSetting;
import de.mossgrabers.framework.observer.IValueObserver;

import com.bitwig.extension.controller.api.SettableRangedValue;
import com.bitwig.extension.controller.api.Setting;


/**
 * Bitwig implementation of a integer setting.
 *
 * @author Jürgen Moßgraber
 */
public class IntegerSettingImpl extends AbstractSetting implements IIntegerSetting
{
    private final SettableRangedValue rangedValue;
    private final int                 range;
    private final int                 minimum;


    /**
     * Constructor.
     *
     * @param rangedValue The ranged value
     * @param minimum The minimum value
     * @param range The range
     */
    public IntegerSettingImpl (final SettableRangedValue rangedValue, final int minimum, final int range)
    {
        super ((Setting) rangedValue);

        this.rangedValue = rangedValue;
        this.minimum = minimum;
        this.range = range;
    }


    /** {@inheritDoc} */
    @Override
    public void set (final int value)
    {
        this.rangedValue.setRaw (value);
    }


    /** {@inheritDoc} */
    @Override
    public void set (final Integer value)
    {
        this.set (value.intValue ());
    }


    /** {@inheritDoc} */
    @Override
    public Integer get ()
    {
        return Integer.valueOf ((int) this.rangedValue.getRaw ());
    }


    /** {@inheritDoc} */
    @Override
    public void addValueObserver (final IValueObserver<Integer> observer)
    {
        this.rangedValue.addValueObserver (this.range, value -> observer.update (Integer.valueOf (this.minimum + value)));

        // Directly fire the current value
        final int value = (int) this.rangedValue.getRaw ();
        observer.update (Integer.valueOf (value));
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/framework/configuration/SettingsUIImpl.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.framework.configuration;

import de.mossgrabers.framework.configuration.IActionSetting;
import de.mossgrabers.framework.configuration.IBooleanSetting;
import de.mossgrabers.framework.configuration.IColorSetting;
import de.mossgrabers.framework.configuration.IDoubleSetting;
import de.mossgrabers.framework.configuration.IEnumSetting;
import de.mossgrabers.framework.configuration.IIntegerSetting;
import de.mossgrabers.framework.configuration.ISettingsUI;
import de.mossgrabers.framework.configuration.ISignalSetting;
import de.mossgrabers.framework.configuration.IStringSetting;
import de.mossgrabers.framework.controller.color.ColorEx;

import com.bitwig.extension.controller.api.Action;
import com.bitwig.extension.controller.api.ActionCategory;
import com.bitwig.extension.controller.api.Application;
import com.bitwig.extension.controller.api.ControllerHost;
import com.bitwig.extension.controller.api.SettableEnumValue;
import com.bitwig.extension.controller.api.Settings;

import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;


/**
 * The Bitwig implementation to create user interface widgets for settings.
 *
 * @author Jürgen Moßgraber
 */
public class SettingsUIImpl implements ISettingsUI
{
    private final ControllerHost         host;
    private final Settings               preferences;
    private String []                    categoryNames;
    private final Map<String, String []> categoriesActionIDs = new HashMap<> ();
    private final Map<String, String>    actionCategories    = new HashMap<> ();
    private final Map<String, String>    actionIDsNames      = new HashMap<> ();


    /**
     * Constructor.
     *
     * @param host The Bitwig controller host
     * @param settings The Bitwig preferences
     */
    public SettingsUIImpl (final ControllerHost host, final Settings settings)
    {
        this.host = host;
        this.preferences = settings;
    }


    /** {@inheritDoc} */
    @Override
    public IEnumSetting getEnumSetting (final String label, final String category, final String [] options, final String initialValue)
    {
        return new EnumSettingImpl (this.preferences.getEnumSetting (label, category, options, initialValue));
    }


    /** {@inheritDoc} */
    @Override
    public IBooleanSetting getBooleanSetting (final String label, final String category, final boolean initialValue)
    {
        return new BooleanSettingImpl (this.preferences.getBooleanSetting (label, category, initialValue));
    }


    /** {@inheritDoc} */
    @Override
    public IStringSetting getStringSetting (final String label, final String category, final int numChars, final String initialText)
    {
        return new StringSettingImpl (this.preferences.getStringSetting (label, category, numChars, initialText));
    }


    /** {@inheritDoc} */
    @Override
    public IDoubleSetting getNumberSetting (final String label, final String category, final double minValue, final double maxValue, final double stepResolution, final String unit, final double initialValue)
    {
        return new DoubleSettingImpl (this.preferences.getNumberSetting (label, category, minValue, maxValue, stepResolution, unit, initialValue));
    }


    /** {@inheritDoc} */
    @Override
    public IIntegerSetting getRangeSetting (final String label, final String category, final int minValue, final int maxValue, final int stepResolution, final String unit, final int initialValue)

    {
        return new IntegerSettingImpl (this.preferences.getNumberSetting (label, category, minValue, maxValue, stepResolution, unit, initialValue), minValue, maxValue - minValue + 1);
    }


    /** {@inheritDoc} */
    @Override
    public ISignalSetting getSignalSetting (final String label, final String category, final String action)
    {
        return new SignalSettingImpl (this.preferences.getSignalSetting (label, category, action));
    }


    /** {@inheritDoc} */
    @Override
    public IColorSetting getColorSetting (final String label, final String category, final ColorEx defaultColor)
    {
        final com.bitwig.extension.api.Color color = com.bitwig.extension.api.Color.fromRGB (defaultColor.getRed (), defaultColor.getGreen (), defaultColor.getBlue ());
        return new ColorSettingImpl (this.preferences.getColorSetting (label, category, color));
    }


    /** {@inheritDoc} */
    @Override
    public IActionSetting getActionSetting (final String label, final String category)
    {
        // Has to be here since it must be executed in the initialize method!
        this.prepareActions ();

        final String cat = category + " - " + label;

        final SettableEnumValue categorySetting = this.preferences.getEnumSetting (label + ": Category", cat, this.categoryNames, this.categoryNames[0]);
        final Map<String, SettableEnumValue> categoryActionsSettings = new TreeMap<> ();

        for (final String categoryName: this.categoryNames)
        {
            final String [] actionNames = this.categoriesActionIDs.get (categoryName);
            if (actionNames.length > 1)
                categoryActionsSettings.put (categoryName, this.preferences.getEnumSetting (label + ": " + categoryName + " Actions", cat, actionNames, actionNames[0]));
        }

        return new ActionSettingImpl (categorySetting, categoryActionsSettings, this.actionIDsNames, this.actionCategories);
    }


    private synchronized void prepareActions ()
    {
        if (this.categoryNames != null)
            return;

        final Application application = this.host.createApplication ();
        final ActionCategory [] categories = application.getActionCategories ();
        this.categoryNames = new String [categories.length];

        for (int i = 0; i < categories.length; i++)
        {
            final String categoryName = categories[i].getName ();
            this.categoryNames[i] = categoryName;

            final Action [] actions = categories[i].getActions ();
            final String [] actionNames = new String [actions.length];

            for (int j = 0; j < actions.length; j++)
            {
                actionNames[j] = actions[j].getName ();
                final String id = actions[j].getId ();
                this.actionIDsNames.put (id, actionNames[j]);
                this.actionCategories.put (id, categoryName);
            }

            this.categoriesActionIDs.put (categoryName, actionNames);
        }
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/framework/configuration/SignalSettingImpl.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.framework.configuration;

import de.mossgrabers.framework.configuration.ISignalSetting;
import de.mossgrabers.framework.observer.IValueObserver;

import com.bitwig.extension.controller.api.Setting;
import com.bitwig.extension.controller.api.Signal;


/**
 * Bitwig implementation of a signal setting.
 *
 * @author Jürgen Moßgraber
 */
public class SignalSettingImpl extends AbstractSetting implements ISignalSetting
{
    private final Signal signalValue;


    /**
     * Constructor.
     *
     * @param signalValue The signal value
     */
    public SignalSettingImpl (final Signal signalValue)
    {
        super ((Setting) signalValue);

        this.signalValue = signalValue;
    }


    /** {@inheritDoc} */
    @Override
    public void addSignalObserver (final IValueObserver<Void> observer)
    {
        this.signalValue.addSignalObserver ( () -> observer.update (null));
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/framework/configuration/StringSettingImpl.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.framework.configuration;

import de.mossgrabers.framework.configuration.IStringSetting;
import de.mossgrabers.framework.observer.IValueObserver;

import com.bitwig.extension.controller.api.SettableStringValue;
import com.bitwig.extension.controller.api.Setting;


/**
 * Bitwig implementation of a string setting.
 *
 * @author Jürgen Moßgraber
 */
public class StringSettingImpl extends AbstractSetting implements IStringSetting
{
    private final SettableStringValue stringValue;


    /**
     * Constructor.
     *
     * @param stringValue The string value
     */
    public StringSettingImpl (final SettableStringValue stringValue)
    {
        super ((Setting) stringValue);

        this.stringValue = stringValue;
    }


    /** {@inheritDoc} */
    @Override
    public void set (final String value)
    {
        this.stringValue.set (value);
    }


    /** {@inheritDoc} */
    @Override
    public String get ()
    {
        return this.stringValue.get ();
    }


    /** {@inheritDoc} */
    @Override
    public void addValueObserver (final IValueObserver<String> observer)
    {
        this.stringValue.addValueObserver (observer::update);

        // Directly fire the current value
        observer.update (this.stringValue.get ());
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/framework/daw/ApplicationImpl.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.framework.daw;

import com.bitwig.extension.controller.api.Action;
import com.bitwig.extension.controller.api.ActionCategory;
import com.bitwig.extension.controller.api.Application;
import com.bitwig.extension.controller.api.Arranger;

import de.mossgrabers.bitwig.framework.daw.data.Util;
import de.mossgrabers.framework.controller.valuechanger.IValueChanger;
import de.mossgrabers.framework.daw.IApplication;
import de.mossgrabers.framework.daw.constants.RecordQuantization;
import de.mossgrabers.framework.parameter.IParameter;
import de.mossgrabers.framework.parameter.ZoomParameter;


/**
 * Proxy to the Bitwig Application.
 *
 * @author Jürgen Moßgraber
 */
public class ApplicationImpl implements IApplication
{
    private final Application   application;
    private final Arranger      arranger;
    private final ZoomParameter horizontalZoomParameter;
    private final ZoomParameter verticalZoomParameter;


    /**
     * Constructor.
     *
     * @param application The application object
     * @param arranger The arranger
     * @param valueChanger The value changer
     */
    public ApplicationImpl (final Application application, final Arranger arranger, final IValueChanger valueChanger)
    {
        this.application = application;
        this.arranger = arranger;

        this.horizontalZoomParameter = new ZoomParameter (valueChanger, this, true);
        this.verticalZoomParameter = new ZoomParameter (valueChanger, this, true);

        this.application.canUndo ().markInterested ();
        this.application.canRedo ().markInterested ();
        this.application.hasActiveEngine ().markInterested ();
        this.application.panelLayout ().markInterested ();
        this.application.recordQuantizationGrid ().markInterested ();
        this.application.recordQuantizeNoteLength ().markInterested ();
    }


    /** {@inheritDoc} */
    @Override
    public void enableObservers (final boolean enable)
    {
        Util.setIsSubscribed (this.application.canUndo (), enable);
        Util.setIsSubscribed (this.application.canRedo (), enable);
        Util.setIsSubscribed (this.application.hasActiveEngine (), enable);
        Util.setIsSubscribed (this.application.panelLayout (), enable);
        Util.setIsSubscribed (this.application.recordQuantizationGrid (), enable);
        Util.setIsSubscribed (this.application.recordQuantizeNoteLength (), enable);
    }


    /** {@inheritDoc} */
    @Override
    public boolean isEngineActive ()
    {
        return this.application.hasActiveEngine ().get ();
    }


    /** {@inheritDoc} */
    @Override
    public void setEngineActive (final boolean active)
    {
        if (active)
            this.application.activateEngine ();
        else
            this.application.deactivateEngine ();
    }


    /** {@inheritDoc} */
    @Override
    public void toggleEngineActive ()
    {
        if (this.application.hasActiveEngine ().get ())
            this.application.deactivateEngine ();
        else
            this.application.activateEngine ();
    }


    /** {@inheritDoc} */
    @Override
    public void setPanelLayout (final String panelLayout)
    {
        this.application.setPanelLayout (panelLayout);
    }


    /** {@inheritDoc} */
    @Override
    public String getPanelLayout ()
    {
        return this.application.panelLayout ().get ();
    }


    /** {@inheritDoc} */
    @Override
    public void previousPanelLayout ()
    {
        this.application.previousPanelLayout ();
    }


    /** {@inheritDoc} */
    @Override
    public void nextPanelLayout ()
    {
        this.application.nextPanelLayout ();
    }


    /** {@inheritDoc} */
    @Override
    public boolean isArrangeLayout ()
    {
        return PANEL_LAYOUT_ARRANGE.equals (this.getPanelLayout ());
    }


    /** {@inheritDoc} */
    @Override
    public boolean isMixerLayout ()
    {
        return PANEL_LAYOUT_MIX.equals (this.getPanelLayout ());
    }


    /** {@inheritDoc} */
    @Override
    public boolean isEditLayout ()
    {
        return PANEL_LAYOUT_EDIT.equals (this.getPanelLayout ());
    }


    /** {@inheritDoc} */
    @Override
    public boolean isPlayLayout ()
    {
        return PANEL_LAYOUT_PLAY.equals (this.getPanelLayout ());
    }


    /** {@inheritDoc} */
    @Override
    public void toggleNoteEditor ()
    {
        this.application.toggleNoteEditor ();
    }


    /** {@inheritDoc} */
    @Override
    public void toggleAutomationEditor ()
    {
        this.application.toggleAutomationEditor ();
    }


    /** {@inheritDoc} */
    @Override
    public void toggleDevices ()
    {
        this.application.toggleDevices ();
    }


    /** {@inheritDoc} */
    @Override
    public void toggleInspector ()
    {
        this.application.toggleInspector ();
    }


    /** {@inheritDoc} */
    @Override
    public void toggleMixer ()
    {
        this.application.toggleMixer ();
    }


    /** {@inheritDoc} */
    @Override
    public void toggleFullScreen ()
    {
        this.application.toggleFullScreen ();
    }


    /** {@inheritDoc} */
    @Override
    public void toggleBrowserVisibility ()
    {
        this.application.toggleBrowserVisibility ();
    }


    /** {@inheritDoc} */
    @Override
    public void duplicate ()
    {
        this.application.duplicate ();
    }


    /** {@inheritDoc} */
    @Override
    public void deleteSelection ()
    {
        this.application.remove ();
    }


    /** {@inheritDoc} */
    @Override
    public boolean canUndo ()
    {
        return this.application.canUndo ().get ();
    }


    /** {@inheritDoc} */
    @Override
    public void undo ()
    {
        this.application.undo ();
    }


    /** {@inheritDoc} */
    @Override
    public boolean canRedo ()
    {
        return this.application.canRedo ().get ();
    }


    /** {@inheritDoc} */
    @Override
    public void redo ()
    {
        this.application.redo ();
    }


    /** {@inheritDoc} */
    @Override
    public void addAudioTrack ()
    {
        this.application.createAudioTrack (-1);
    }


    /** {@inheritDoc} */
    @Override
    public void addEffectTrack ()
    {
        this.application.createEffectTrack (-1);
    }


    /** {@inheritDoc} */
    @Override
    public void addInstrumentTrack ()
    {
        this.application.createInstrumentTrack (-1);
    }


    /** {@inheritDoc} */
    @Override
    public void arrowKeyLeft ()
    {
        this.application.arrowKeyLeft ();
    }


    /** {@inheritDoc} */
    @Override
    public void arrowKeyUp ()
    {
        this.application.arrowKeyUp ();
    }


    /** {@inheritDoc} */
    @Override
    public void arrowKeyRight ()
    {
        this.application.arrowKeyRight ();
    }


    /** {@inheritDoc} */
    @Override
    public void arrowKeyDown ()
    {
        this.application.arrowKeyDown ();
    }


    /** {@inheritDoc} */
    @Override
    public void enter ()
    {
        this.application.enter ();
    }


    /** {@inheritDoc} */
    @Override
    public void escape ()
    {
        this.application.escape ();
    }


    /** {@inheritDoc} */
    @Override
    public void zoomOut ()
    {
        this.arranger.zoomOut ();
    }


    /** {@inheritDoc} */
    @Override
    public void zoomIn ()
    {
        this.arranger.zoomIn ();
    }


    /** {@inheritDoc} */
    @Override
    public IParameter getZoomParameter ()
    {
        return this.horizontalZoomParameter;
    }


    /** {@inheritDoc} */
    @Override
    public void incTrackHeight ()
    {
        this.arranger.zoomInLaneHeightsAll ();
    }


    /** {@inheritDoc} */
    @Override
    public void decTrackHeight ()
    {
        this.arranger.zoomOutLaneHeightsAll ();
    }


    /** {@inheritDoc} */
    @Override
    public IParameter getTrackHeightParameter ()
    {
        return this.verticalZoomParameter;
    }


    /**
     * Test if record quantization for note lengths is enabled.
     *
     * @return True if enabled
     */
    public boolean isRecordQuantizationNoteLength ()
    {
        return this.application.recordQuantizeNoteLength ().get ();
    }


    /**
     * Toggle record quantization note length enablement.
     */
    public void toggleRecordQuantizationNoteLength ()
    {
        this.application.recordQuantizeNoteLength ().toggle ();
    }


    /**
     * Get the record quantization grid.
     *
     * @return The record quantization grid resolution
     */
    public RecordQuantization getRecordQuantizationGrid ()
    {
        return RecordQuantization.lookup (this.application.recordQuantizationGrid ().get ());
    }


    /**
     * Set the record quantization grid.
     *
     * @param recordQuantization The record quantization grid resolution
     */
    public void setRecordQuantizationGrid (final RecordQuantization recordQuantization)
    {
        this.application.recordQuantizationGrid ().set (recordQuantization.getValue ());
    }


    /** {@inheritDoc} */
    @Override
    public void sliceToSampler ()
    {
        this.invokeAction ("slice_to_multi_sampler_track");
    }


    /** {@inheritDoc} */
    @Override
    public void sliceToDrumMachine ()
    {
        this.invokeAction ("slice_to_drum_track");
    }


    /** {@inheritDoc} */
    @Override
    public void invokeAction (final String id)
    {
        final Action action = this.getAction (id);
        if (action != null)
            action.invoke ();
    }


    /**
     * Returns the action for the given action identifier.
     *
     * @param id the action identifier string, must not be `null`
     * @return The action
     */
    private Action getAction (final String id)
    {
        return this.application.getAction (id);
    }


    /**
     * Returns a list of action categories that is used by Bitwig Studio to group actions into
     * categories.
     *
     * @return All action categories
     */
    public ActionCategory [] getActionCategories ()
    {
        return this.application.getActionCategories ();
    }


    /**
     * Returns the action category associated with the given identifier.
     *
     * @param id the category identifier string, must not be `null`
     * @return The category
     */
    public ActionCategory getActionCategory (final String id)
    {
        return this.application.getActionCategory (id);
    }


    /** {@inheritDoc} */
    @Override
    public void showHelp ()
    {
        final Action action = this.getAction ("show_online_learning");
        if (action != null)
            action.invoke ();
    }
}


================================================
FILE: src/main/java/de/mossgrabers/bitwig/framework/daw/ArrangerImpl.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.framework.daw;

import de.mossgrabers.bitwig.framework.daw.data.Util;
import de.mossgrabers.framework.daw.IArranger;

import com.bitwig.extension.controller.api.Arranger;


/**
 * Encapsulates the Arranger instance.
 *
 * @author Jürgen Moßgraber
 */
public class ArrangerImpl implements IArranger
{
    private final Arranger arranger;


    /**
     * Constructor
     *
     * @param arranger The arranger
     */
    public ArrangerImpl (final Arranger arranger)
    {
        this.arranger = arranger;

        this.arranger.areCueMarkersVisible ().markInterested ();
        this.arranger.isPlaybackFollowEnabled ().markInterested ();
        this.arranger.hasDoubleRowTrackHeight ().markInterested ();
        this.arranger.isClipLauncherVisible ().markInterested ();
        this.arranger.isTimelineVisible ().markInterested ();
        this.arranger.isIoSectionVisible ().markInterested ();
        this.arranger.areEffectTracksVisible ().markInterested ();
    }


    /** {@inheritDoc} */
    @Override
    public void enableObservers (final boolean enable)
    {
        Util.setIsSubscribed (this.arranger.areCueMarkersVisible (), enable);
        Util.setIsSubscribed (this.arranger.isPlaybackFollowEnabled (), enable);
        Util.setIsSubscribed (this.arranger.hasDoubleRowTrackHeight (), enable);
        Util.setIsSubscribed (this.arranger.isClipLauncherVisible (), enable);
        Util.setIsSubscribed (this.arranger.isTimelineVisible (), enable);
        Util.setIsSubscribed (this.arranger.isIoSectionVisible (), enable);
        Util.setIsSubscribed (this.arranger.areEffectTracksVisible (), enable);
    }


    /** {@inheritDoc} */
    @Override
    public boolean areCueMarkersVisible ()
    {
        return this.arranger.areCueMarkersVisible ().get ();
    }


    /** {@inheritDoc} */
    @Override
    public void toggleCueMarkerVisibility ()
    {
        this.arranger.areCueMarkersVisible ().toggle ();
    }


    /** {@inheritDoc} */
    @Override
    public boolean isPlaybackFollowEnabled ()
    {
        return this.arranger.isPlaybackFollowEnabled ().get ();
    }


    /** {@inheritDoc} */
    @Override
    public void togglePlaybackFollow ()
    {
        this.arranger.isPlaybackFollowEnabled ().toggle ();
    }


    /** {@inheritDoc} */
    @Override
    public boolean hasDoubleRowTrackHeight ()
    {
        return this.arranger.hasDoubleRowTrackHeight ().get ();
    }


    /** {@inheritDoc} */
    @Override
    public void toggleTrackRowHeight ()
    {
        this.arranger.hasDoubleRowTrackHeight ().toggle ();
    }


    /** {@inheritDoc} */
    @Override
    public boolean isClipLauncherVisible ()
    {
        return this.arranger.isClipLauncherVisible ().get ();
    }


    /** {@inheritDoc} */
    @Override
    public void toggleClipLauncher ()
    {
        this.arranger.isClipLauncherVisible ().toggle ();
    }


    /** {@inheritDoc} */
    @Override
    public boolean isTimelineVisible ()
    {
        return this.arranger.isTimelineVisible ().get ();
    }


    /** {@inheritDoc} */
    @Override
    public void toggleTimeLine ()
    {
        this.arranger.isTimelineVisible ().toggle ();
    }


    /** {@inheritDoc} */
    @Override
    public boolean isIoSectionVisible ()
    {
        return this.arranger.isIoSectionVisible ().get ();
    }


    /** {@inheritDoc} */
    @Override
    public void toggleIoSection ()
    {
        this.arranger.isIoSectionVisible ().toggle ();
    }


    /** {@inheritDoc} */
    @Override
    public boolean areEffectTracksVisible ()
    {
        return this.arranger.areEffectTracksVisible ().get ();
    }


    /** {@inheritDoc} */
    @Override
    public void toggleEffectTracks ()
    {
        this.arranger.areEffectTracksVisible ().toggle ();
    }
}


================================================
FILE: src/main/java/de/mossgrabers/bitwig/framework/daw/BrowserImpl.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.framework.daw;

import com.bitwig.extension.controller.api.BrowserFilterColumn;
import com.bitwig.extension.controller.api.BrowserResultsItemBank;
import com.bitwig.extension.controller.api.CursorBrowserResultItem;
import com.bitwig.extension.controller.api.CursorDevice;
import com.bitwig.extension.controller.api.CursorTrack;
import com.bitwig.extension.controller.api.InsertionPoint;
import com.bitwig.extension.controller.api.PopupBrowser;

import de.mossgrabers.bitwig.framework.daw.data.BrowserColumnImpl;
import de.mossgrabers.bitwig.framework.daw.data.BrowserColumnItemImpl;
import de.mossgrabers.bitwig.framework.daw.data.ChannelImpl;
import de.mossgrabers.bitwig.framework.daw.data.CursorDeviceImpl;
import de.mossgrabers.bitwig.framework.daw.data.DrumPadImpl;
import de.mossgrabers.bitwig.framework.daw.data.SlotImpl;
import de.mossgrabers.bitwig.framework.daw.data.Util;
import de.mossgrabers.framework.daw.AbstractBrowser;
import de.mossgrabers.framework.daw.IHost;
import de.mossgrabers.framework.daw.data.IBrowserColumn;
import de.mossgrabers.framework.daw.data.IBrowserColumnItem;
import de.mossgrabers.framework.daw.data.IChannel;
import de.mossgrabers.framework.daw.data.IItem;


/**
 * Provides access to the device, preset, sample, ... browser.
 *
 * @author Jürgen Moßgraber
 */
public class BrowserImpl extends AbstractBrowser
{
    private final IHost                   host;
    private final CursorDevice            cursorDevice;
    private final CursorTrack             cursorTrack;
    private final PopupBrowser            browser;
    private final BrowserFilterColumn []  filterColumns;
    private final CursorBrowserResultItem cursorResult;
    private final BrowserResultsItemBank  resultsItemBank;


    /**
     * Constructor.
     *
     * @param host The host
     * @param browser The browser
     * @param cursorTrack The cursor track
     * @param cursorDevice The cursor device
     * @param numFilterColumnEntries The number of entries in a filter column page
     * @param numResults The number of entries in a results column page
     */
    public BrowserImpl (final IHost host, final PopupBrowser browser, final CursorTrack cursorTrack, final CursorDevice cursorDevice, final int numFilterColumnEntries, final int numResults)
    {
        super (numFilterColumnEntries, numResults);

        this.host = host;
        this.cursorTrack = cursorTrack;
        this.cursorDevice = cursorDevice;

        this.browser = browser;

        this.browser.exists ().addValueObserver (this::fireActiveObserver);
        this.browser.selectedContentTypeIndex ().markInterested ();
        this.browser.selectedContentTypeName ().markInterested ();
        this.browser.contentTypeNames ().markInterested ();
        this.browser.shouldAudition ().markInterested ();

        this.filterColumns = new BrowserFilterColumn []
        {
            // TODO API extension required - Remove this for the time being until the browser API
            // gets adapted to Bitwig 5
            // this.browser.smartCollectionColumn (),
            this.browser.locationColumn (),
            this.browser.fileTypeColumn (),
            this.browser.categoryColumn (),
            this.browser.tagColumn (),
            this.browser.creatorColumn (),
            this.browser.deviceTypeColumn (),
            this.browser.deviceColumn ()
        };

        this.columnData = this.createFilterColumns (this.filterColumns.length, numFilterColumnEntries);

        this.cursorResult = (CursorBrowserResultItem) this.browser.resultsColumn ().createCursorItem ();
        this.cursorResult.name ().markInterested ();

        this.resultsItemBank = (BrowserResultsItemBank) this.cursorResult.createSiblingsBank (this.numResults);
        this.resultData = this.createResultData (this.numResults);
    }


    /** {@inheritDoc} */
    @Override
    public void enableObservers (final boolean enable)
    {
        Util.setIsSubscribed (this.browser.exists (), enable);
        Util.setIsSubscribed (this.browser.selectedContentTypeIndex (), enable);
        Util.setIsSubscribed (this.browser.selectedContentTypeName (), enable);
        Util.setIsSubscribed (this.browser.contentTypeNames (), enable);
        Util.setIsSubscribed (this.browser.shouldAudition (), enable);

        for (final IBrowserColumn column: this.columnData)
            column.enableObservers (enable);

        Util.setIsSubscribed (this.cursorResult.name (), enable);

        for (final IBrowserColumnItem item: this.resultData)
            item.enableObservers (enable);
    }


    /** {@inheritDoc} */
    @Override
    public boolean isPresetContentType ()
    {
        return this.getSelectedContentTypeIndex () == 1;
    }


    /** {@inheritDoc} */
    @Override
    public int getSelectedContentTypeIndex ()
    {
        return this.browser.selectedContentTypeIndex ().get ();
    }


    /** {@inheritDoc} */
    @Override
    public void previousContentType ()
    {
        this.browser.selectedContentTypeIndex ().inc (-1);
    }


    /** {@inheritDoc} */
    @Override
    public void nextContentType ()
    {
        this.browser.selectedContentTypeIndex ().inc (1);
    }


    /** {@inheritDoc} */
    @Override
    public String getSelectedContentType ()
    {
        return "Result";
        // TODO API extension required - Currently not working in Bitwig 5, requires adaption to the
        // new browser
        // return this.browser.selectedContentTypeName ().get ();
    }


    /** {@inheritDoc} */
    @Override
    public String [] getContentTypeNames ()
    {
        return this.browser.contentTypeNames ().get ();
    }


    /** {@inheritDoc} */
    @Override
    public boolean isPreviewEnabled ()
    {
        return this.browser.shouldAudition ().get ();
    }


    /** {@inheritDoc} */
    @Override
    public void togglePreviewEnabled ()
    {
        this.browser.shouldAudition ().toggle ();
    }


    /** {@inheritDoc} */
    @Override
    public void setPreviewEnabled (final boolean isEnabled)
    {
        this.browser.shouldAudition ().set (isEnabled);
    }


    /** {@inheritDoc} */
    @Override
    public void replace (final IItem item)
    {
        final InsertionPoint insertionPoint;
        if (item instanceof final CursorDeviceImpl cursorDeviceImpl)
            insertionPoint = cursorDeviceImpl.getCursorDevice ().replaceDeviceInsertionPoint ();
        else if (item instanceof final SlotImpl slot)
            insertionPoint = slot.getSlot ().replaceInsertionPoint ();
        else if (item instanceof final DrumPadImpl drumPad)
            insertionPoint = drumPad.getDrumPad ().insertionPoint ();
        else
            return;

        final String name = item.getName ();
        this.infoText = "Replace: " + (name.length () == 0 ? "Empty" : name);

        this.browse (insertionPoint);
    }


    /** {@inheritDoc} */
    @Override
    public void addDevice (final IChannel channel)
    {
        this.infoText = "Add device to: " + channel.getName ();

        this.browse (((ChannelImpl) channel).getDeviceChain ().startOfDeviceChainInsertionPoint ());
    }


    /** {@inheritDoc} */
    @Override
    public void insertBeforeCursorDevice ()
    {
        this.infoText = INSERT_DEVICE_BEFORE + this.cursorDevice.name ().get ();

        this.browse (this.cursorDevice.exists ().get () ? this.cursorDevice.beforeDeviceInsertionPoint () : this.cursorTrack.startOfDeviceChainInsertionPoint ());
    }


    /** {@inheritDoc} */
    @Override
    public void insertAfterCursorDevice ()
    {
        this.infoText = INSERT_DEVICE_AFTER + this.cursorDevice.name ().get ();

        this.browse (this.cursorDevice.exists ().get () ? this.cursorDevice.afterDeviceInsertionPoint () : this.cursorTrack.endOfDeviceChainInsertionPoint ());
    }


    /** {@inheritDoc} */
    @Override
    public void toggleInsertionPoint ()
    {
        if (this.infoText.startsWith (INSERT_DEVICE_BEFORE))
            this.insertAfterCursorDevice ();
        else
            this.insertBeforeCursorDevice ();
    }


    private void browse (final InsertionPoint insertionPoint)
    {
        this.stopBrowsing (false);

        if (insertionPoint == null)
            return;

        // Delay a bit to give the previous browser the chance to shutdown
        this.host.scheduleTask (insertionPoint::browse, 100);
    }


    /** {@inheritDoc} */
    @Override
    public void stopBrowsing (final boolean commitSelection)
    {
        if (commitSelection)
            this.browser.commit ();
        else
            this.browser.cancel ();
    }


    /** {@inheritDoc} */
    @Override
    public boolean isActive ()
    {
        return this.browser.exists ().get ();
    }


    /** {@inheritDoc} */
    @Override
    public void selectPreviousResult ()
    {
        this.cursorResult.selectPrevious ();
    }


    /** {@inheritDoc} */
    @Override
    public void selectNextResult ()
    {
        this.cursorResult.selectNext ();
    }


    /** {@inheritDoc} */
    @Override
    public String getSelectedResult ()
    {
        return this.cursorResult.name ().get ();
    }


    /**
     * Select the previous result page.
     */
    public void previousResultPage ()
    {
        this.resultsItemBank.scrollPageBackwards ();
    }


    /**
     * Select the next result page.
     */
    public void nextResultPage ()
    {
        this.resultsItemBank.scrollPageForwards ();
    }


    private IBrowserColumn [] createFilterColumns (final int count, final int numFilterColumnEntries)
    {
        final IBrowserColumn [] columns = new IBrowserColumn [count];
        for (int i = 0; i < count; i++)
            columns[i] = new BrowserColumnImpl (this.filterColumns[i], i, numFilterColumnEntries);
        return columns;
    }


    private IBrowserColumnItem [] createResultData (final int count)
    {
        final IBrowserColumnItem [] items = new IBrowserColumnItem [count];
        for (int i = 0; i < count; i++)
            items[i] = new BrowserColumnItemImpl (this.resultsItemBank.getItemAt (i), i);
        return items;
    }
}


================================================
FILE: src/main/java/de/mossgrabers/bitwig/framework/daw/ClipLauncherNavigatorImpl.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.framework.daw;

import com.bitwig.extension.controller.api.ClipLauncherSlot;
import com.bitwig.extension.controller.api.ClipLauncherSlotBank;
import com.bitwig.extension.controller.api.ControllerHost;
import com.bitwig.extension.controller.api.CursorTrack;
import com.bitwig.extension.controller.api.SceneBank;
import com.bitwig.extension.controller.api.Track;
import com.bitwig.extension.controller.api.TrackBank;

import de.mossgrabers.framework.daw.IClipLauncherNavigator;
import de.mossgrabers.framework.daw.IModel;
import de.mossgrabers.framework.daw.data.ITrack;
import de.mossgrabers.framework.daw.data.bank.ISceneBank;
import de.mossgrabers.framework.daw.data.bank.ITrackBank;


/**
 * Implementation for a clip launcher navigator.
 *
 * @author Jürgen Moßgraber
 */
public class ClipLauncherNavigatorImpl implements IClipLauncherNavigator
{
    private final ControllerHost   host;
    private final IModel           model;
    private final CursorTrack      cursorTrack;
    private final ClipLauncherSlot theClip;
    private final Track            theTrack;
    protected TrackBank            singleTrackBank;
    protected SceneBank            sceneBank;


    /**
     * Constructor.
     *
     * @param host The controller host
     * @param model The model
     */
    ClipLauncherNavigatorImpl (final ControllerHost host, final IModel model)
    {
        this.host = host;
        this.model = model;

        this.singleTrackBank = host.createTrackBank (1, 0, 1);
        this.singleTrackBank.scrollPosition ().markInterested ();
        this.cursorTrack = host.createCursorTrack (1, 1);
        this.singleTrackBank.followCursorTrack (this.cursorTrack);
        this.theTrack = this.singleTrackBank.getItemAt (0);

        final ClipLauncherSlotBank slotBank = this.theTrack.clipLauncherSlotBank ();
        this.singleTrackBank.setShouldShowClipLauncherFeedback (true);
        this.theClip = slotBank.getItemAt (0);

        this.theClip.sceneIndex ().addValueObserver (position -> {
            final ISceneBank isceneBank = this.model.getSceneBank ();
            final int pageSize = isceneBank.getPageSize ();
            final int scrollPosition = isceneBank.getScrollPosition ();
            final int newPosition = position / pageSize * pageSize;
            if (scrollPosition != newPosition)
                isceneBank.scrollTo (newPosition);
            isceneBank.getItem (position % pageSize).select ();
        });

        this.sceneBank = this.singleTrackBank.sceneBank ();
        this.sceneBank.cursorIndex ().markInterested ();
        this.sceneBank.setIndication (false);
    }


    /** {@inheritDoc} */
    @Override
    public void navigateScenes (final boolean isLeft)
    {
        this.navigateClips (isLeft);
        this.host.scheduleTask ( () -> this.sceneBank.getItemAt (0).selectInEditor (), 100);
    }


    /** {@inheritDoc} */
    @Override
    public void navigateClips (final boolean isLeft)
    {
        if (isLeft)
            this.sceneBank.scrollBackwards ();
        else
            this.sceneBank.scrollForwards ();
        this.theClip.select ();
        this.theClip.showInEditor ();
    }


    /** {@inheritDoc} */
    @Override
    public void navigateTracks (final boolean isLeft)
    {
        if (isLeft)
            this.singleTrackBank.scrollBackwards ();
        else
            this.singleTrackBank.scrollForwards ();
        // this.singleTrackBank.scrollBy (isLeft ? -1 : 1);
        this.theClip.select ();
        this.theClip.showInEditor ();

        this.theTrack.selectInEditor ();
        this.theTrack.selectInMixer ();
        this.theTrack.makeVisibleInArranger ();
        this.theTrack.makeVisibleInMixer ();
    }


    /** {@inheritDoc} */
    @Override
    public void selectTrack (final int index)
    {
        final ITrackBank trackBank = this.model.getTrackBank ();
        final ITrack track = trackBank.getItem (0);
        if (!track.doesExist ())
            return;
        this.singleTrackBank.scrollPosition ().set (track.getPosition () + index);
        trackBank.getItem (index).select ();
    }
}



================================================
FILE: src/main/java/de/mossgrabers/bitwig/framework/daw/CursorClipImpl.java
================================================
// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2017-2025
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

package de.mossgrabers.bitwig.framework.daw;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.bitwig.extension.controller.api.Clip;
import com.bitwig.extension.controller.api.CursorTrack;
import com.bitwig.extension.controller.api.NoteOccurrence;
import com.bitwig.extension.controller.api.NoteStep;
import com.bitwig.extension.controller.api.PinnableCursorClip;
import com.bitwig.extension.controller.api.SettableColorValue;

import de.mossgrabers.bitwig.framework.daw.data.Util;
import de.mossgrabers.framework.controller.color.ColorEx;
import de.mossgrabers.framework.controller.valuechanger.IValueChanger;
import de.mossgrabers.framework.daw.IHost;
import de.mossgrabers.framework.daw.clip.INoteClip;
import de.mossgrabers.framework.daw.clip.IStepInfo;
import de.mossgrabers.framework.daw.clip.NoteOccurrenceType;
import de.mossgrabers.framework.daw.clip.NotePosition;
import de.mossgrabers.framework.daw.clip.StepState;
import de.mossgrabers.framework.daw.constants.Resolution;
import de.mossgrabers.framework.daw.constants.TransportConstants;
import de.mossgrabers.framework.daw.data.empty.EmptyStepInfo;


/**
 * Proxy to the Bitwig Cursor clip.
 *
 * @author Jürgen Moßgraber
 */
public class CursorClipImpl implements INoteClip
{
    /** The range of the transpose attribute. */
    private static final double      TRANSPOSE_RANGE = 96.0;

    private final IHost              host;
    private final IValueChanger      valueChanger;
    private final int                numSteps;
    private final int                numRows;

    private final IStepInfo [] [] [] launcherData;
    private final PinnableCursorClip launcherClip;
    private int                      editPage        = 0;
    private double                   stepLength;
    private final List<NotePosition> editSteps       = new ArrayList<> ();


    /**
     * Constructor.
     *
     * @param host The host
     * @param cursorTrack The cursor track
     * @param valueChanger The value changer
     * @param numSteps The number of steps of the clip to monitor
     * @param numRows The number of note rows of the clip to monitor
     */
    public CursorClipImpl (final IHost host, final CursorTrack cursorTrack, final IValueChanger valueChanger, final int numSteps, final int numRows)
    {
        this.host = host;
        this.valueChanger = valueChanger;

        this.numSteps = numSteps;
        this.numRows = numRows;
        this.stepLength = 1.0 / 4.0; // 16th

        this.launcherData = new IStepInfo [16] [this.numSteps] [];

        // TODO Bugfix required: https://github.com/teotigraphix/Framework4Bitwig/issues/140
        this.launcherClip = cursorTrack.createLauncherCursorClip (this.numSteps, this.numRows);

        this.launcherClip.addNoteStepObserver (this::handleStepData);

        this.launcherClip.exists ().markInterested ();
        this.launcherClip.playingStep ().markInterested ();
        this.launcherClip.getPlayStart ().markInterested ();
        this.launcherClip.getPlayStop ().markInterested ();
        this.launcherClip.getLoopStart ().markInterested ();
        this.launcherClip.getLoopLength ().markInterested ();
        this.launcherClip.isLoopEnabled ().markInterested ();
        this.launcherClip.getShuffle ().markInterested ();
        this.launcherClip.getAccent ().markInterested ();
        this.launcherClip.canScrollStepsBackwards ().markInterested ();
        this.launcherClip.canScrollStepsForwards ().markInterested ();
        this.launcherClip.color ().markInterested ();
        this.launcherClip.isPinned ().markInterested ();

        this.launcherClip.getTrack ().canHoldNoteData ().markInterested ();
    }


    /** {@inheritDoc} */
    @Override
    public void enableObservers (final boolean enable)
    {
        Util.setIsSubscribed (this.launcherClip.exists (), enable);
        Util.setIsSubscribed (this.launcherClip.playingStep (), enable);
        Util.setIsSubscribed (this.launcherClip.getPlayStart (), enable);
        Util.setIsSubscribed (this.launcherClip.getPlayStop (), enable);
        Util.setIsSubscribed (this.launcherClip.getLoopStart (), enable);
        Util.setIsSubscribed (this.launcherClip.getLoopLength (), enable);
        Util.setIsSubscribed (this.launcherClip.isLoopEnabled (), enable);
        Util.setIsSubscribed (this.launcherClip.getShuffle (), enable);
        Util.setIsSubscribed (this.launcherClip.getAccent (), enable);
        Util.setIsSubscribed (this.launcherClip.canScrollStepsBackwards (), enable);
        Util.setIsSubscribed (this.launcherClip.canScrollStepsForwards (), enable);
        Util.setIsSubscribed (this.launcherClip.color (), enable);
        Util.setIsSubscribed (this.launcherClip.isPinned (), enable);
        Util.setIsSubscribed (this.launcherClip.getTrack ().canHoldNoteData (), enable);
    }


    /** {@inheritDoc} */
    @Override
    public boolean doesExist ()
    {
        return this.getClip ().exists ().get ();
    }


    /** {@inheritDoc} */
    @Override
    public void setName (final String name)
    {
        this.getClip ().setName (name);
    }


    /** {@inheritDoc} */
    @Override
    public void setColor (final ColorEx color)
    {
        this.getClip ().color ().set ((float) color.getRed (), (float) color.getGreen (), (float) color.getBlue ());
    }


    /** {@inheritDoc} */
    @Override
    public ColorEx getColor ()
    {
        final SettableColorValue color = this.getClip ().color ();
        return new ColorEx (color.red (), color.green (), color.blue ());
    }


    /** {@inheritDoc} */
    @Override
    public boolean isPinned ()
    {
        return this.launcherClip.isPinned ().get ();
    }


    /** {@inheritDoc} */
    @Override
    public void togglePinned ()
    {
        this.launcherClip.isPinned ().toggle ();
    }


    /** {@inheritDoc} */
    @Override
    public void setPinned (final boolean isPinned)
    {
        this.launcherClip.isPinned ().set (isPinned);
    }


    /** {@inheritDoc} */
    @Override
    public double getPlayStart ()
    {
        return this.getClip ().getPlayStart ().get ();
    }


    /** {@inheritDoc} */
    @Override
    public void setPlayStart (final double start)
    {
        this.getClip ().getPlayStart ().set (start);
    }


    /** {@inheritDoc} */
    @Override
    public void changePlayStart (final int control, final boolean slow)
    {
        final boolean increase = this.valueChanger.isIncrease (control);
        final double frac = slow ? TransportConstants.INC_FRACTION_TIME_SLOW : TransportConstants.INC_FRACTION_TIME;
        this.getClip ().getPlayStart ().inc (increase ? frac : -frac);
    }


    /** {@inheritDoc} */
    @Override
    public double getPlayEnd ()
    {
        return this.getClip ().getPlayStop ().get ();
    }


    /** {@inheritDoc} */
    @Override
    public void setPlayEnd (final double end)
    {
        this.getClip ().getPlayStop ().set (end);
    }


    /** {@inheritDoc} */
    @Override
    public void changePlayEnd (final int control, final boolean slow)
    {
        final boolean increase = this.valueChanger.isIncrease (control);
        final double frac = slow ? TransportConstants.INC_FRACTION_TIME_SLOW : TransportConstants.INC_FRACTION_TIME;
        this.getClip ().getPlayStop ().inc (increase ? frac : -frac);
    }


    /** {@inheritDoc} */
    @Override
    public void setPlayRange (final double start, final double end)
    {
        // Need to distinguish if we move left or right since the start and
        // end cannot be the same value
        if (this.getPlayStart () < start)
        {
            this.setPlayEnd (end);
            this.setPlayStart (start);
        }
        else
        {
            this.setPlayStart (start);
            this.setPlayEnd (end);
        }
    }


    /** {@inheritDoc} */
    @Override
    public double getLoopStart ()
    {
        return this.getClip ().getLoopStart ().get ();
    }


    /** {@inheritDoc} */
    @Override
    public void setLoopStart (final double start)
    {
        this.getClip ().getLoopStart ().set (start);
    }


    /** {@inheritDoc} */
    @Override
    public void changeLoopStart (final int control, final boolean slow)
    {
        final boolean increase = this.valueChanger.isIncrease (control);
        final double frac = slow ? TransportConstants.INC_FRACTION_TIME_SLOW : TransportConstants.INC_FRACTION_TIME;
        this.getClip ().getLoopStart ().inc (increase ? frac : -frac);
    }


    /** {@inheritDoc} */
    @Override
    public double getLoopLength ()
    {
        return this.getClip ().getLoopLength ().get ();
    }


    /** {@inheritDoc} */
    @Override
    public void setLoopLength (final double length)
    {
        this.getClip ().getLoopLength ().set (length);
    }


    /** {@inheritDoc} */
    @Override
    public void changeLoopLength (final int control, final boolean slow)
    {
        final boolean increase = this.valueChanger.isIncrease (control);
        final double frac = slow ? TransportConstants.INC_FRACTION_TIME_SLOW : TransportConstants.INC_FRACTION_TIME;
        this.getClip ().getLoopLength ().inc (increase ? frac : -frac);
    }


    /** {@inheritDoc} */
    @Override
    public boolean isLoopEnabled ()
    {
        return this.getClip ().isLoopEnabled ().get ();
    }


    /** {@inheritDoc} */
    @Override
    public void setLoopEnabled (final boolean enable)
    {
        this.getClip ().isLoopEnabled ().set (enable);
    }


    /** {@inheritDoc} */
    @Override
    public boolean isShuffleEnabled ()
    {
        return this.getClip ().getShuffle ().get ();
    }


    /** {@inheritDoc} */
    @Override
    public void setShuffleEnabled (final boolean enable)
    {
        this.getClip ().getShuffle ().set (enable);
    }


    /** {@inheritDoc} */
    @Override
    public String getFormattedAccent ()
    {
        return Math.round (this.getAccent ()) + "%";
    }


    /** {@inheritDoc} */
    @Override
    public double getAccent ()
    {
        return this.getClip ().getAccent ().get () * 200 - 100;
    }


    /** {@inheritDoc} */
    @Override
    public void resetAccent ()
    {
        this.getClip ().getAccent ().setImmediately (0.5);
    }


    /** {@inheritDoc} */
    @Override
    public void changeAccent (final int control, final boolean slow)
    {
        final double offset = slow ? 1 : 10;
        final double value = this.valueChanger.isIncrease (control) ? this.getAccent () + offset : this.getAccent () - offset;
        this.getClip ().getAccent ().set (Math.max (0, Math.min (1, (value + 100) / 200)));
    }


    /** {@inheritDoc} */
    @Override
    public int getNumSteps ()
    {
        return this.numSteps;
    }


    /** {@inheritDoc} */
    @Override
    public int getNumRows ()
    {
        return this.numRows;
    }


    /** {@inheritDoc} */
    @Override
    public int getCurrentStep ()
    {
        return this.getClip ().playingStep ().get ();
    }


    /** {@inheritDoc} */
    @Override
    public void setStepLength (final double length)
    {
        this.stepLength = length;
        this.launcherClip.setStepSize (length);
    }


    /** {@inheritDoc} */
    @Override
    public double getStepLength ()
    {
        return this.stepLength;
    }


    /** {@inheritDoc} */
    @Override
    public IStepInfo getStep (final NotePosition notePosition)
    {
        final IStepInfo [] [] [] stepInfos = this.getStepInfos ();
        final int channel = notePosition.getChannel ();
        final int step = notePosition.getStep ();
        final int row = notePosition.getNote ();
        try
        {
            if (stepInfos[channel][step] == null || stepInfos[channel][step][row] == null)
                return EmptyStepInfo.INSTANCE;
            return stepInfos[channel][step][row];
        }
        catch (final ArrayIndexOutOfBoundsException ex)
        {
            this.host.error ("Illegal index accessing step info array.", ex);
            return EmptyStepInfo.INSTANCE;
        }
    }


    /** {@inheritDoc} */
    @Override
    public void toggleStep (final NotePosition notePosition, final int velocity)
    {
        this.getClip ().toggleStep (notePosition.getChannel (), notePosition.getStep (), notePosition.getNote (), velocity);
    }


    /** {@inheritDoc} */
    @Override
    public void setStep (final NotePosition notePosition, final int velocity, final double duration)
    {
        this.getClip ().setStep (notePosition.getChannel (), notePosition.getStep (), notePosition.getNote (), velocity, duration);
    }


    /** {@inheritDoc} */
    @Override
    public void setStep (final NotePosition notePosition, final IStepInfo noteStep)
    {
        final NotePosition destinationPosition = new NotePosition (notePosition);
        final IStepInfo noteStepCopy = noteStep.createCopy ();

        this.setStep (destinationPosition, (int) (noteStepCopy.getVelocity () * 127), noteStepCopy.getDuration ());
        this.host.scheduleTask ( () -> {

            this.updateStepVelocity (destinationPosition, noteStepCopy.getVelocity ());
            this.updateStepGain (destinationPosition, noteStepCopy.getGain ());
            this.updateStepPan (destinationPosition, noteStepCopy.getPan ());
            this.updateStepPressure (destinationPosition, noteStepCopy.getPressure ());
            this.updateStepReleaseVelocity (destinationPosition, noteStepCopy.getReleaseVelocity ());
            this.updateStepTimbre (destinationPosition, noteStepCopy.getTimbre ());
            this.updateStepTranspose (destinationPosition, noteStepCopy.getTranspose ());

        }, 100);
    }


    /** {@inheritDoc} */
    @Override
    public void clearStep (final NotePosition notePosition)
    {
        this.getClip ().clearStep (notePosition.getChannel (), notePosition.getStep (), notePosition.getNote ());
    }


    /** {@inheritDoc} */
    @Override
    public void moveStepY (final NotePosition notePosition, final int newRow)
    {
        final int row = notePosition.getNote ();
        this.getClip ().moveStep (notePosition.getChannel (), notePosition.getStep (), row, 0, newRow - row);
    }


    /** {@inheritDoc} */
    @Override
    public void changeStepMuteState (final NotePosition notePosition, final int control)
    {
        final boolean increase = this.valueChanger.isIncrease (control);
        this.updateStepMuteState (notePosition, increase);
    }


    /** {@inheritDoc} */
    @Override
    public void updateStepMuteState (final NotePosition notePosition, final boolean isMuted)
    {
        final StepInfoImpl stepInfo = this.getUpdateableStep (notePosition);
        stepInfo.setMuted (isMuted);
        if (this.editSteps.isEmpty ())
            this.getNoteStep (notePosition).setIsMuted (isMuted);
    }


    /** {@inheritDoc} */
    @Override
    public void changeStepDuration (final NotePosition notePosition, final int control)
    {
        final IStepInfo info = this.getStep (notePosition);
        final boolean increase = this.valueChanger.isIncrease (control);
        final double res = Resolution.RES_1_32.getValue ();
        this.updateStepDuration (notePosition, Math.max (0, info.getDuration () + (increase ? res : -res)));
    }


    /** {@inheritDoc} */
    @Override
    public void updateStepDuration (final NotePosition notePosition, final double duration)
    {
        final double d = Math.max (0, duration);
        final StepInfoImpl stepInfo = this.getUpdateableStep (notePosition);
        stepInfo.setDuration (d);
        if (this.editSteps.isEmpty ())
            this.getNoteStep (notePosition).setDuration (d);
    }


    /** {@inheritDoc} */
    @Overri