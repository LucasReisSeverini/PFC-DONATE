package br.fai.backend.donate.backend.main.dao.postgres.configuration;

import br.fai.backend.donate.backend.main.port.service.util.ResourceFileService;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;
import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

@Configuration
@Profile("prod")
public class PostgresConnectionManagerConfiguration {

    @Value("${spring.datasource.base.url}")
    private String databaseBaseUrl;

    @Value("${spring.datasource.url}")
    private String databaseUrl;

    @Value("${spring.datasource.username}")
    private String databaseUsername;

    @Value("${spring.datasource.password}")
    private String databasePassword;

    @Value("${spring.datasource.name}")
    private String databaseName;

    @Autowired
    private ResourceFileService resourceFileService;

    /**
     * Cria o banco de dados se não existir.
     */
    @Bean
    public DataSource dataSource() throws SQLException {
        DataSource baseDataSource = DataSourceBuilder
                .create()
                .url(databaseBaseUrl)
                .username(databaseUsername)
                .password(databasePassword)
                .build();

        try (Connection connection = baseDataSource.getConnection()) {
            createDatabaseIfNotExists(connection);
        }

        // Retorna DataSource apontando para o banco correto
        HikariConfig hikariConfig = new HikariConfig();
        hikariConfig.setJdbcUrl(databaseUrl);
        hikariConfig.setUsername(databaseUsername);
        hikariConfig.setPassword(databasePassword);

        return new HikariDataSource(hikariConfig);
    }

    /**
     * Executa os scripts de criação de tabela e inserção de dados.
     */
    @Bean
    @DependsOn("dataSource")
    public boolean createTableAndInsertData(DataSource dataSource) throws SQLException, IOException {
        try (Connection connection = dataSource.getConnection(); Statement statement = connection.createStatement()) {

            final String basePath = "lds-db-scripts";

            // Criação das tabelas
            String createTablesSql = resourceFileService.read(basePath + "/create-tables-postgres.sql");
            statement.execute(createTablesSql); // execute() funciona para múltiplas instruções

            // Inserção dos dados
            String insertDataSql = resourceFileService.read(basePath + "/insert-data.sql");
            statement.execute(insertDataSql);
        }

        return true;
    }

    private void createDatabaseIfNotExists(Connection connection) throws SQLException {
        try (Statement statement = connection.createStatement()) {
            String sql = "SELECT COUNT(*) AS dbs FROM pg_catalog.pg_database WHERE lower(datname) = '"
                    + databaseName.toLowerCase() + "';";
            try (ResultSet resultSet = statement.executeQuery(sql)) {
                boolean dbExists = resultSet.next() && resultSet.getInt("dbs") > 0;

                if (!dbExists) {
                    String createDbSql = "CREATE DATABASE " + databaseName +
                            " WITH OWNER = postgres ENCODING = 'UTF8' CONNECTION LIMIT = -1;";
                    statement.execute(createDbSql);
                }
            }
        }
    }
}
